import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const env = {
  port: Number(process.env.PORT || 3333),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  geminiFallbackModel: process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite",
  geminiMaxRetries: Number(process.env.GEMINI_MAX_RETRIES || 2),
  geminiRetryBaseDelayMs: Number(process.env.GEMINI_RETRY_BASE_DELAY_MS || 1500),
  memoryRetentionDays: Number(process.env.MEMORY_RETENTION_DAYS || 90)
};
