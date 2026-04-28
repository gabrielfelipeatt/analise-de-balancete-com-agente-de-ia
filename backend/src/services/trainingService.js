import { askGemini, buildSystemPrompt } from "./geminiService.js";
import { getActiveMemories, saveMemory } from "./brainService.js";

const MAX_DOCUMENT_CHARS = 115000;

function truncateText(text, maxChars = MAX_DOCUMENT_CHARS) {
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

export async function trainFromChat(message) {
  const activeMemories = await getActiveMemories();
  const response = await askGemini([
    { role: "system", content: buildSystemPrompt(activeMemories) },
    { role: "user", content: `Transforme este ensinamento em uma memoria objetiva para analises futuras:\n\n${message}` }
  ]);

  const memory = await saveMemory({
    type: "chat_teaching",
    origin: "chat",
    summary: response.slice(0, 300),
    content: { teaching: message, gemini_summary: response },
    markAsTraining: true
  });

  return { response: `Entendido. Registrei este ensinamento no brain e vou usa-lo enquanto a memoria estiver valida.`, memory };
}

export async function trainFromPdf({ filename, text }) {
  const activeMemories = await getActiveMemories();
  const documentText = truncateText(text);
  const response = await askGemini([
    { role: "system", content: buildSystemPrompt(activeMemories) },
    { role: "user", content: `Estude este balancete fiscal e gere um resumo de aprendizados para memorias futuras.\n\nArquivo: ${filename}\n\nConteudo:\n${documentText}` }
  ]);

  const memory = await saveMemory({
    type: "pdf_training",
    origin: "pdf",
    summary: response.slice(0, 300),
    content: {
      filename,
      gemini_summary: response,
      extracted_text: documentText,
      extracted_text_chars: text.length
    },
    markAsTraining: true
  });

  return { response, memory };
}
