import { Router } from "express";
import { getConfigStatus, saveConfig } from "../controllers/configController.js";
import { cleanExpiredMemories, getBrainStatus, listMemories } from "../controllers/brainController.js";
import { trainChat, trainPdf } from "../controllers/trainingController.js";
import { askQuestion } from "../controllers/chatController.js";
import { uploadPdf } from "../controllers/pdfController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireGroqKey, requireTrainedAgent } from "../middlewares/guards.js";
import { upload } from "../middlewares/upload.js";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ ok: true }));
routes.get("/config", getConfigStatus);
routes.post("/config/groq", saveConfig);

routes.get("/brain/status", asyncHandler(getBrainStatus));
routes.get("/brain/memories", asyncHandler(listMemories));
routes.post("/brain/clean-expired", asyncHandler(cleanExpiredMemories));

routes.post("/training/chat", requireGroqKey, asyncHandler(trainChat));
routes.post("/training/pdf", requireGroqKey, upload.single("file"), asyncHandler(trainPdf));

routes.post("/chat", requireGroqKey, asyncHandler(requireTrainedAgent), asyncHandler(askQuestion));
routes.post("/pdf/analyze", requireGroqKey, asyncHandler(requireTrainedAgent), upload.single("file"), asyncHandler(uploadPdf));
