import fs from "node:fs/promises";
import pdf from "pdf-parse";

export async function extractPdfText(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdf(buffer);
  return data.text.trim();
}
