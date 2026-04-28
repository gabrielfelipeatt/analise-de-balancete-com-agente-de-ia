import { hasGeminiApiKey } from "../services/apiKeyService.js";
import { isTrained } from "../services/brainService.js";
import { HttpError } from "../utils/httpError.js";

export function requireGeminiKey(_req, _res, next) {
  if (!hasGeminiApiKey()) {
    return next(new HttpError(401, "Configure a chave da API Google Gemini antes de usar o agente."));
  }
  next();
}

export async function requireTrainedAgent(_req, _res, next) {
  if (!(await isTrained())) {
    return next(new HttpError(403, "O agente precisa ser treinado pelo menos uma vez antes desta acao."));
  }
  next();
}
