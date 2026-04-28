import { askGroq, buildSystemPrompt } from "./groqService.js";
import { getActiveMemories, getActiveMemoryDocuments, saveMemory } from "./brainService.js";

const MAX_DOCUMENT_CHARS = 115000;
const MAX_CONTEXT_CHARS = 115000;

function truncateText(text, maxChars = MAX_DOCUMENT_CHARS) {
  return text.length > maxChars ? text.slice(0, maxChars) : text;
}

function buildPdfMemoryContext(pdfMemories) {
  let usedChars = 0;
  const contextBlocks = [];

  for (const memory of [...pdfMemories].reverse()) {
    const extractedText = memory.content?.extracted_text || "";
    const analysis = memory.content?.groq_analysis || memory.content?.groq_summary || "";
    const filename = memory.content?.filename || "arquivo sem nome";
    const availableChars = MAX_CONTEXT_CHARS - usedChars;

    if (availableChars <= 0) break;

    const block = [
      `Memoria: ${memory.id}`,
      `Arquivo: ${filename}`,
      analysis ? `Analise salva:\n${analysis}` : "",
      extractedText ? `Texto extraido do balancete:\n${extractedText}` : ""
    ].filter(Boolean).join("\n\n");

    const truncatedBlock = block.slice(0, availableChars);
    usedChars += truncatedBlock.length;
    contextBlocks.push(truncatedBlock);
  }

  return contextBlocks.join("\n\n---\n\n");
}

export async function analyzePdf({ filename, text }) {
  const activeMemories = await getActiveMemories();
  const documentText = truncateText(text);
  const response = await askGroq([
    { role: "system", content: buildSystemPrompt(activeMemories) },
    {
      role: "user",
      content: [
        "Analise o balancete abaixo.",
        "Retorne um resumo, pontos de atencao, perguntas genericas e perguntas especificas do PDF.",
        "Separe a resposta em secoes claras.",
        `Arquivo: ${filename}`,
        `Conteudo:\n${documentText}`
      ].join("\n\n")
    }
  ]);

  const memory = await saveMemory({
    type: "pdf_analysis",
    origin: "pdf",
    summary: `Analise do arquivo ${filename}`,
    content: {
      filename,
      groq_analysis: response,
      extracted_text: documentText,
      extracted_text_chars: text.length
    }
  });

  return { response, memory };
}

export async function answerQuestion({ question, currentContext = "" }) {
  const activeMemories = await getActiveMemories();
  const pdfMemories = await getActiveMemoryDocuments({ types: ["pdf_analysis", "pdf_training"] });
  const pdfMemoryContext = buildPdfMemoryContext(pdfMemories);
  const response = await askGroq([
    { role: "system", content: buildSystemPrompt(activeMemories) },
    {
      role: "user",
      content: [
        "Responda usando prioritariamente o contexto dos balancetes abaixo.",
        "Quando a pergunta pedir valor, conta, saldo ou total, procure no texto extraido antes de concluir que nao ha informacao.",
        "Se houver mais de um balancete no contexto, use o mais recente ou cite o arquivo utilizado.",
        `Contexto atual da conversa:\n${currentContext || "Sem contexto atual informado."}`,
        `Balancetes salvos no brain:\n${pdfMemoryContext || "Nao ha texto de balancete salvo nas memorias ativas."}`,
        `Pergunta do usuario:\n${question}`
      ].join("\n\n")
    }
  ]);

  await saveMemory({
    type: "chat_question",
    origin: "chat",
    summary: question.slice(0, 300),
    content: {
      question,
      answer: response,
      used_pdf_memory_ids: pdfMemories.map((memory) => memory.id)
    }
  });

  return { response };
}
