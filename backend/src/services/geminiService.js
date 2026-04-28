import { env } from "../config/env.js";
import { getGeminiApiKey } from "./apiKeyService.js";
import { HttpError } from "../utils/httpError.js";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const HIGH_DEMAND_PATTERN = /high demand|overloaded|resource exhausted|rate limit|quota/i;

function getApiKey() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new HttpError(401, "Configure a chave da API Google Gemini antes de usar o agente.");
  }
  return apiKey;
}

function toGeminiContents(messages) {
  return messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: String(message.content || "") }]
    }));
}

function toSystemInstruction(messages) {
  const systemText = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .filter(Boolean)
    .join("\n\n");

  return systemText ? { parts: [{ text: systemText }] } : undefined;
}

export async function askGemini(messages, options = {}) {
  const apiKey = getApiKey();
  const models = getModelAttempts(options.model);
  const body = {
    contents: toGeminiContents(messages),
    generationConfig: {
      temperature: options.temperature ?? 0.2
    },
    systemInstruction: toSystemInstruction(messages)
  };
  let lastError;

  for (const model of models) {
    for (let attempt = 0; attempt <= env.geminiMaxRetries; attempt += 1) {
      try {
        return await requestGemini({ apiKey, model, body });
      } catch (error) {
        lastError = error;
        if (!isRetryableGeminiError(error) || attempt === env.geminiMaxRetries) {
          break;
        }

        await delay(getRetryDelayMs(attempt));
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new HttpError(502, "Falha ao comunicar com a API Google Gemini.");
}

async function requestGemini({ apiKey, model, body }) {
  const url = `${GEMINI_API_BASE_URL}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error?.message || "Falha ao comunicar com a API Google Gemini.";
    const status = response.status >= 500 ? 502 : response.status;
    const error = new HttpError(status, message);
    error.providerStatus = response.status;
    error.providerMessage = message;
    error.model = model;
    throw error;
  }

  return data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
}

function getModelAttempts(requestedModel) {
  const models = [requestedModel || env.geminiModel, env.geminiFallbackModel].filter(Boolean);
  return [...new Set(models)];
}

function isRetryableGeminiError(error) {
  const status = error.providerStatus || error.status;
  const message = error.providerMessage || error.message || "";
  return status === 429 || status >= 500 || HIGH_DEMAND_PATTERN.test(message);
}

function getRetryDelayMs(attempt) {
  return env.geminiRetryBaseDelayMs * 2 ** attempt;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildSystemPrompt(activeMemories = []) {
  const memoryContext = activeMemories.map((memory) => `- ${memory.summary}`).join("\n");

  return [
    "Voce e um agente de IA contabil e fiscal especializado em analise de balancetes.",
    "Responda em portugues do Brasil, com clareza profissional e foco em riscos, variacoes e inconsistencias.",
    "Nao invente dados. Se o PDF ou a memoria nao tiver informacao suficiente, diga isso.",
    "Nunca solicite, revele ou registre a chave da API Google Gemini.",
    memoryContext ? `Memorias validas do agente:\n${memoryContext}` : "Nao ha memorias validas disponiveis."
  ].join("\n\n");
}
