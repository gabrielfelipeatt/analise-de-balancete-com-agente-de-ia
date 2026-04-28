import { answerQuestion } from "../services/analysisService.js";
import { HttpError } from "../utils/httpError.js";

export async function askQuestion(req, res) {
  const { question, currentContext } = req.body;
  if (!question) throw new HttpError(400, "Informe uma pergunta.");
  const result = await answerQuestion({ question, currentContext });
  res.json(result);
}
