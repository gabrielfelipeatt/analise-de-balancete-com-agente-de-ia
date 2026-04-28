import multer from "multer";
import path from "node:path";
import { uploadsDir } from "../utils/paths.js";
import { HttpError } from "../utils/httpError.js";

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf";
    if (!isPdf) return cb(new HttpError(400, "Apenas arquivos PDF sao aceitos."));
    cb(null, true);
  }
});
