import { extractPdfText } from "../services/pdfService.js";
import { trainFromChat, trainFromPdf } from "../services/trainingService.js";
import { HttpError } from "../utils/httpError.js";

export async function trainChat(req, res) {
  const { message } = req.body;
  if (!message) throw new HttpError(400, "Informe uma mensagem de treinamento.");
  const result = await trainFromChat(message);
  res.json(result);
}

export async function trainPdf(req, res) {
  if (!req.file) throw new HttpError(400, "Envie um arquivo PDF para treinamento.");
  const text = await extractPdfText(req.file.path);
  const result = await trainFromPdf({ filename: req.file.originalname, text });
  res.json(result);
}
