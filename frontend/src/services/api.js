const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3333/api";
const MASTER_KEY = import.meta.env.VITE_MASTER_KEY || "sua_chave_mestra_aqui";

async function request(path, options = {}) {
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  headers["x-master-key"] = MASTER_KEY;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Erro ao comunicar com o servidor.");
  return data;
}

export const api = {
  getConfig: () => request("/config"),
  saveGeminiKey: (apiKey) => request("/config/gemini", { method: "POST", body: JSON.stringify({ apiKey }) }),
  removeGeminiKey: () => request("/config/gemini", { method: "DELETE" }),
  getBrainStatus: () => request("/brain/status"),
  trainChat: (message) => request("/training/chat", { method: "POST", body: JSON.stringify({ message }) }),
  trainPdf: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/training/pdf", { method: "POST", body: formData });
  },
  analyzePdf: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/pdf/analyze", { method: "POST", body: formData });
  },
  ask: (question, currentContext) => request("/chat", { method: "POST", body: JSON.stringify({ question, currentContext }) }),
  cleanExpired: () => request("/brain/clean-expired", { method: "POST" }),
  
  getConversations: () => request("/conversations"),
  createConversation: (name, groupId) => request("/conversations", { method: "POST", body: JSON.stringify({ name, groupId }) }),
  updateConversation: (id, data) => request(`/conversations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteConversation: (id) => request(`/conversations/${id}`, { method: "DELETE" }),
  
  createGroup: (name) => request("/groups", { method: "POST", body: JSON.stringify({ name }) }),
  updateGroup: (id, name) => request(`/groups/${id}`, { method: "PUT", body: JSON.stringify({ name }) }),
  deleteGroup: (id) => request(`/groups/${id}`, { method: "DELETE" })
};
