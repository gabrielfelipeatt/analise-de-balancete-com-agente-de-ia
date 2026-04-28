import Groq from "groq-sdk";
import { env } from "../config/env.js";
import { getGroqApiKey } from "./apiKeyService.js";
import { HttpError } from "../utils/httpError.js";

function getClient() {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new HttpError(401, "Configure a chave da API Groq antes de usar o agente.");
  }
  return new Groq({ apiKey });
}

export async function askGroq(messages, options = {}) {
  const client = getClient();
  const completion = await client.chat.completions.create({
    model: options.model || env.groqModel,
    temperature: options.temperature ?? 0.2,
    messages
  });

  return completion.choices?.[0]?.message?.content || "";
}

export function buildSystemPrompt(activeMemories = []) {
  const memoryContext = activeMemories.map((memory) => `- ${memory.summary}`).join("\n");

  return [
    "Voce e um agente de IA contabil e fiscal especializado em analise de balancetes.",
    "Responda em portugues do Brasil, com clareza profissional e foco em riscos, variacoes e inconsistencias.",
    "Nao invente dados. Se o PDF ou a memoria nao tiver informacao suficiente, diga isso.",
    "Nunca solicite, revele ou registre a chave da API Groq.",
    memoryContext ? `Memorias validas do agente:\n${memoryContext}` : "Nao ha memorias validas disponiveis."
  ].join("\n\n");
}
