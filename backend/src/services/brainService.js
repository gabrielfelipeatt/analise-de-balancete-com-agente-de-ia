import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { brainDir, brainIndexPath } from "../utils/paths.js";

const memoryFolders = {
  pdf_training: ["memories", "pdf"],
  pdf_analysis: ["memories", "analysis"],
  chat_teaching: ["memories", "chat"],
  chat_question: ["memories", "chat"]
};

export async function ensureBrain() {
  await fs.mkdir(path.join(brainDir, "memories", "pdf"), { recursive: true });
  await fs.mkdir(path.join(brainDir, "memories", "chat"), { recursive: true });
  await fs.mkdir(path.join(brainDir, "memories", "analysis"), { recursive: true });
  await fs.mkdir(path.join(brainDir, "summaries"), { recursive: true });
  await fs.mkdir(path.join(brainDir, "indexes"), { recursive: true });
  await fs.mkdir(path.join(brainDir, "retention", "expired"), { recursive: true });

  try {
    await fs.access(brainIndexPath);
  } catch {
    await writeIndex({ version: 1, trained: false, last_training_at: null, memories: [] });
  }
}

export async function readIndex() {
  await ensureBrain();
  const raw = await fs.readFile(brainIndexPath, "utf8");
  return JSON.parse(raw);
}

export async function writeIndex(index) {
  await fs.writeFile(brainIndexPath, JSON.stringify(index, null, 2), "utf8");
}

export function createExpirationDate(createdAt = new Date()) {
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + env.memoryRetentionDays);
  return expiresAt;
}

export async function saveMemory({ type, origin, summary, content, markAsTraining = false }) {
  await ensureBrain();

  const createdAt = new Date();
  const expiresAt = createExpirationDate(createdAt);
  const id = `mem_${createdAt.toISOString().replace(/[-:.TZ]/g, "")}_${randomUUID().slice(0, 8)}`;
  const memory = {
    id,
    type,
    origin,
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    status: "active",
    summary,
    content
  };

  const folderParts = memoryFolders[type] || ["memories", "analysis"];
  const filePath = path.join(brainDir, ...folderParts, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(memory, null, 2), "utf8");

  const index = await readIndex();
  index.memories = [...index.memories, { id, type, origin, path: path.relative(brainDir, filePath), created_at: memory.created_at, expires_at: memory.expires_at, status: "active", summary }];

  if (markAsTraining) {
    index.trained = true;
    index.last_training_at = memory.created_at;
  }

  await writeIndex(index);
  return memory;
}

export async function getActiveMemories() {
  const index = await readIndex();
  const now = new Date();
  return index.memories.filter((memory) => memory.status === "active" && new Date(memory.expires_at) > now);
}

export async function getActiveMemoryDocuments({ types } = {}) {
  const activeMemories = await getActiveMemories();
  const filteredMemories = types?.length
    ? activeMemories.filter((memory) => types.includes(memory.type))
    : activeMemories;

  const documents = [];

  for (const memory of filteredMemories) {
    try {
      const raw = await fs.readFile(path.join(brainDir, memory.path), "utf8");
      documents.push(JSON.parse(raw));
    } catch {
      // Ignore missing or invalid memory files and keep the chat usable.
    }
  }

  return documents;
}

export async function getExpiredMemories() {
  const index = await readIndex();
  const now = new Date();
  return index.memories.filter((memory) => memory.status === "active" && new Date(memory.expires_at) <= now);
}

export async function isTrained() {
  const index = await readIndex();
  return Boolean(index.trained);
}
