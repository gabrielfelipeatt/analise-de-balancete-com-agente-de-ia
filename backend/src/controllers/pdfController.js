import { analyzePdf } from "../services/analysisService.js";
import { extractPdfText } from "../services/pdfService.js";
import { HttpError } from "../utils/httpError.js";

export async function uploadPdf(req, res) {
  if (!req.file) throw new HttpError(400, "Envie um arquivo PDF.");
  const text = await extractPdfText(req.file.path);
  const result = await analyzePdf({ filename: req.file.originalname, text });
  res.json(result);
}
