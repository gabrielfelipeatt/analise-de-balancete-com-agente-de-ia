import fs from "node:fs/promises";
import path from "node:path";
import { brainDir } from "../utils/paths.js";
import { getExpiredMemories, readIndex, writeIndex } from "./brainService.js";

export async function getRetentionNotice() {
  const expired = await getExpiredMemories();
  return {
    hasExpiredMemories: expired.length > 0,
    count: expired.length,
    affectedTypes: [...new Set(expired.map((memory) => memory.type))],
    memories: expired.map(({ id, type, origin, created_at, expires_at, summary }) => ({ id, type, origin, created_at, expires_at, summary }))
  };
}

export async function archiveExpiredMemories() {
  const expired = await getExpiredMemories();
  const index = await readIndex();
  const expiredDir = path.join(brainDir, "retention", "expired");
  await fs.mkdir(expiredDir, { recursive: true });

  for (const memory of expired) {
    const source = path.join(brainDir, memory.path);
    const target = path.join(expiredDir, `${memory.id}.json`);

    try {
      await fs.rename(source, target);
    } catch {
      // If the file is already missing, only update the index.
    }

    const indexMemory = index.memories.find((item) => item.id === memory.id);
    if (indexMemory) {
      indexMemory.status = "expired";
      indexMemory.path = path.relative(brainDir, target);
    }
  }

  await writeIndex(index);
  return { archived: expired.length };
}
