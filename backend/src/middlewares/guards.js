import { hasGeminiApiKey } from "../services/apiKeyService.js";
import { isTrained } from "../services/brainService.js";
import { HttpError } from "../utils/httpError.js";
import { env } from "../config/env.js";

export function requireGeminiKey(_req, _res, next) {
  if (!hasGeminiApiKey()) {
    return next(new HttpError(401, "Configure a chave da API Google Gemini antes de usar o agente."));
  }
  next();
}

export function requireMasterKey(req, _res, next) {
  const { masterKey } = env;

  if (!masterKey) {
    return next(new HttpError(500, "MASTER_KEY nao configurada no servidor."));
  }

  const providedKey = req.headers["x-master-key"];

  if (providedKey !== masterKey) {
    return next(new HttpError(401, "Chave Mestra invalida ou nao fornecida."));
  }

  next();
}

export async function requireTrainedAgent(_req, _res, next) {
  if (!(await isTrained())) {
    return next(new HttpError(403, "O agente precisa ser treinado pelo menos uma vez antes desta acao."));
  }
  next();
}
