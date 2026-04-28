import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const rootDir = path.resolve(__dirname, "../../..");
export const brainDir = path.join(rootDir, "brain");
export const brainIndexPath = path.join(brainDir, "brain-index.json");
export const uploadsDir = path.join(rootDir, "backend", "uploads");
