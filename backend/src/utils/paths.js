import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, "../../..");
const dataDir = process.env.DATA_DIR || rootDir;

export const brainDir = path.join(dataDir, "brain");
export const brainIndexPath = path.join(brainDir, "brain-index.json");
export const conversationsDir = path.join(dataDir, "conversations");
export const groupsPath = path.join(conversationsDir, "groups.json");
export const uploadsDir = path.join(dataDir, "backend", "uploads");
export const secureDir = path.join(dataDir, "backend", ".secure");
export const geminiKeyPath = path.join(secureDir, "gemini-key.json");
