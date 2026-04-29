import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { conversationsDir, groupsPath } from "../utils/paths.js";

async function ensureConversations() {
  await fs.mkdir(conversationsDir, { recursive: true });
  try {
    await fs.access(groupsPath);
  } catch {
    await fs.writeFile(groupsPath, JSON.stringify({ groups: [] }, null, 2));
  }
}

export async function listGroups() {
  await ensureConversations();
  const raw = await fs.readFile(groupsPath, "utf8");
  return JSON.parse(raw).groups;
}

export async function saveGroups(groups) {
  await ensureConversations();
  await fs.writeFile(groupsPath, JSON.stringify({ groups }, null, 2), "utf8");
}

export async function listConversations() {
  await ensureConversations();
  const files = await fs.readdir(conversationsDir);
  const conversations = [];

  for (const file of files) {
    if (file.endsWith(".json") && file !== "groups.json") {
      const raw = await fs.readFile(path.join(conversationsDir, file), "utf8");
      conversations.push(JSON.parse(raw));
    }
  }

  return conversations;
}

export async function getConversation(id) {
  const filePath = path.join(conversationsDir, `${id}.json`);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function saveConversation(conversation) {
  await ensureConversations();
  const id = conversation.id || randomUUID();
  const data = {
    ...conversation,
    id,
    updatedAt: new Date().toISOString()
  };
  if (!data.createdAt) data.createdAt = data.updatedAt;

  const filePath = path.join(conversationsDir, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export async function deleteConversation(id) {
  const filePath = path.join(conversationsDir, `${id}.json`);
  await fs.unlink(filePath);
}

export async function createGroup(name) {
  const groups = await listGroups();
  const newGroup = { id: randomUUID(), name };
  groups.push(newGroup);
  await saveGroups(groups);
  return newGroup;
}

export async function renameGroup(id, name) {
  const groups = await listGroups();
  const group = groups.find(g => g.id === id);
  if (group) {
    group.name = name;
    await saveGroups(groups);
  }
  return group;
}

export async function deleteGroup(id) {
  const groups = await listGroups();
  const filtered = groups.filter(g => g.id !== id);
  await saveGroups(filtered);

  // Move conversations from this group to 'default' (null or empty groupId)
  const conversations = await listConversations();
  for (const conv of conversations) {
    if (conv.groupId === id) {
      conv.groupId = null;
      await saveConversation(conv);
    }
  }
}
