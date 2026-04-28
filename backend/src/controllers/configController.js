import { hasGroqApiKey, maskApiKey, saveGroqApiKey } from "../services/apiKeyService.js";
import { HttpError } from "../utils/httpError.js";

export function getConfigStatus(_req, res) {
  res.json({ hasGroqApiKey: hasGroqApiKey(), maskedKey: maskApiKey() });
}

export function saveConfig(req, res) {
  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== "string") {
    throw new HttpError(400, "Informe uma chave da API Groq valida.");
  }

  saveGroqApiKey(apiKey.trim());
  res.json({ hasGroqApiKey: true, maskedKey: maskApiKey(apiKey.trim()) });
}
