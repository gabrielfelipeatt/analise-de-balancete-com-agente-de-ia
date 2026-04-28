import { hasGeminiApiKey, maskApiKey, removeGeminiApiKey, saveGeminiApiKey } from "../services/apiKeyService.js";
import { HttpError } from "../utils/httpError.js";

export function getConfigStatus(_req, res) {
  res.json({ hasGeminiApiKey: hasGeminiApiKey(), maskedKey: maskApiKey() });
}

export function saveConfig(req, res) {
  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== "string") {
    throw new HttpError(400, "Informe uma chave da API Google Gemini valida.");
  }

  saveGeminiApiKey(apiKey.trim());
  res.json({ hasGeminiApiKey: true, maskedKey: maskApiKey(apiKey.trim()) });
}

export function deleteConfig(_req, res) {
  removeGeminiApiKey();
  res.json({ hasGeminiApiKey: false, maskedKey: "" });
}
