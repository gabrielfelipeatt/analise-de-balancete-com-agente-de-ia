const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3333/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: options.body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    ...options
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
  cleanExpired: () => request("/brain/clean-expired", { method: "POST" })
};
