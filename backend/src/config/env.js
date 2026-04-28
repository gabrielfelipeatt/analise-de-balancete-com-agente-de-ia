import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const env = {
  port: Number(process.env.PORT || 3333),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  groqApiKey: process.env.GROQ_API_KEY || "",
  groqModel: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  memoryRetentionDays: Number(process.env.MEMORY_RETENTION_DAYS || 90)
};
