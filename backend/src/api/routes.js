import { Router } from "express";
import { deleteConfig, getConfigStatus, saveConfig } from "../controllers/configController.js";
import { cleanExpiredMemories, getBrainStatus, listMemories } from "../controllers/brainController.js";
import { trainChat, trainPdf } from "../controllers/trainingController.js";
import { askQuestion } from "../controllers/chatController.js";
import { uploadPdf } from "../controllers/pdfController.js";
import * as conversationController from "../controllers/conversationController.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { requireGeminiKey, requireMasterKey } from "../middlewares/guards.js";
import { upload } from "../middlewares/upload.js";

export const routes = Router();

routes.get("/health", (_req, res) => res.json({ ok: true }));

routes.get("/config", requireMasterKey, getConfigStatus);
routes.post("/config/gemini", requireMasterKey, saveConfig);
routes.delete("/config/gemini", requireMasterKey, deleteConfig);

routes.get("/brain/status", asyncHandler(getBrainStatus));
routes.get("/brain/memories", asyncHandler(listMemories));
routes.post("/brain/clean-expired", requireMasterKey, asyncHandler(cleanExpiredMemories));

routes.get("/conversations", asyncHandler(conversationController.getConversationsData));
routes.post("/conversations", asyncHandler(conversationController.createConversation));
routes.put("/conversations/:id", asyncHandler(conversationController.updateConversation));
routes.delete("/conversations/:id", asyncHandler(conversationController.deleteConversation));

routes.post("/groups", asyncHandler(conversationController.createGroup));
routes.put("/groups/:id", asyncHandler(conversationController.updateGroup));
routes.delete("/groups/:id", asyncHandler(conversationController.deleteGroup));

routes.post("/training/chat", requireGeminiKey, asyncHandler(trainChat));
routes.post("/training/pdf", requireGeminiKey, upload.single("file"), asyncHandler(trainPdf));

routes.post("/chat", requireGeminiKey, asyncHandler(askQuestion));
routes.post("/pdf/analyze", requireGeminiKey, upload.single("file"), asyncHandler(uploadPdf));
