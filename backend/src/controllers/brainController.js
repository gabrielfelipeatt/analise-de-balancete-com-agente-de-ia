import { archiveExpiredMemories, getRetentionNotice } from "../services/memoryRetentionService.js";
import { getActiveMemories, readIndex } from "../services/brainService.js";

export async function getBrainStatus(_req, res) {
  const [index, activeMemories, retentionNotice] = await Promise.all([
    readIndex(),
    getActiveMemories(),
    getRetentionNotice()
  ]);

  res.json({
    trained: Boolean(index.trained),
    lastTrainingAt: index.last_training_at,
    activeMemoriesCount: activeMemories.length,
    retentionNotice
  });
}

export async function listMemories(_req, res) {
  const memories = await getActiveMemories();
  res.json({ memories });
}

export async function cleanExpiredMemories(_req, res) {
  const result = await archiveExpiredMemories();
  res.json(result);
}
