import * as conversationService from "../services/conversationService.js";

export async function getConversationsData(req, res) {
  const groups = await conversationService.listGroups();
  const conversations = await conversationService.listConversations();
  res.json({ groups, conversations });
}

export async function createConversation(req, res) {
  const { name, groupId } = req.body;
  const conversation = await conversationService.saveConversation({ name, groupId, messages: [] });
  res.json(conversation);
}

export async function updateConversation(req, res) {
  const { id } = req.params;
  const { name, groupId, messages } = req.body;
  const existing = await conversationService.getConversation(id);
  const updated = await conversationService.saveConversation({ ...existing, name: name ?? existing.name, groupId: groupId ?? existing.groupId, messages: messages ?? existing.messages });
  res.json(updated);
}

export async function deleteConversation(req, res) {
  const { id } = req.params;
  await conversationService.deleteConversation(id);
  res.json({ ok: true });
}

export async function createGroup(req, res) {
  const { name } = req.body;
  const group = await conversationService.createGroup(name);
  res.json(group);
}

export async function updateGroup(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const group = await conversationService.renameGroup(id, name);
  res.json(group);
}

export async function deleteGroup(req, res) {
  const { id } = req.params;
  await conversationService.deleteGroup(id);
  res.json({ ok: true });
}
