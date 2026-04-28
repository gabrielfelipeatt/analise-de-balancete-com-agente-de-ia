import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const DEFAULT_MASTER_KEY = "sua_chave_mestra_aqui";
const defaultAllowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "null"];
const configuredAllowedOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 3333),
  host: process.env.HOST || "127.0.0.1",
  allowedOrigins: [...new Set([...configuredAllowedOrigins, ...defaultAllowedOrigins])],
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  geminiFallbackModel: process.env.GEMINI_FALLBACK_MODEL || "gemini-2.5-flash-lite",
  geminiMaxRetries: Number(process.env.GEMINI_MAX_RETRIES || 2),
  geminiRetryBaseDelayMs: Number(process.env.GEMINI_RETRY_BASE_DELAY_MS || 1500),
  memoryRetentionDays: Number(process.env.MEMORY_RETENTION_DAYS || 90),
  masterKey: process.env.MASTER_KEY || DEFAULT_MASTER_KEY,
  encryptionSecret: process.env.ENCRYPTION_SECRET || ""
};
