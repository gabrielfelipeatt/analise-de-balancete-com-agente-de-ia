import { useEffect, useMemo, useState } from "react";
import { ApiKeyForm } from "./components/ApiKeyForm/ApiKeyForm.jsx";
import { ChatWindow } from "./components/Chat/ChatWindow.jsx";
import { MemoryNotice } from "./components/MemoryNotice/MemoryNotice.jsx";
import { Sidebar } from "./components/Sidebar/Sidebar.jsx";
import { api } from "./services/api.js";

const initialMessages = [
  {
    id: "welcome",
    role: "assistant",
    content: "Configure a chave Groq e realize o treinamento inicial por PDF ou mensagem no chat."
  }
];

export function App() {
  const [config, setConfig] = useState(null);
  const [brainStatus, setBrainStatus] = useState(null);
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentContext, setCurrentContext] = useState("");

  const locked = useMemo(() => !config?.hasGroqApiKey, [config]);

  async function refreshStatus() {
    const [configData, brainData] = await Promise.all([api.getConfig(), api.getBrainStatus()]);
    setConfig(configData);
    setBrainStatus(brainData);
  }

  useEffect(() => {
    refreshStatus().catch((err) => setError(err.message));
  }, []);

  function pushMessage(role, content) {
    setMessages((current) => [...current, { id: crypto.randomUUID(), role, content }]);
  }

  async function handleSaveKey(apiKey) {
    setLoading(true);
    setError("");
    try {
      const data = await api.saveGroqKey(apiKey);
      setConfig(data);
      pushMessage("assistant", "Chave Groq configurada. Agora faca o treinamento inicial por PDF ou ensinamento no chat.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk(message) {
    setLoading(true);
    setError("");
    pushMessage("user", message);

    try {
      const needsTraining = !brainStatus?.trained;
      const result = needsTraining ? await api.trainChat(message) : await api.ask(message, currentContext);
      pushMessage("assistant", result.response);
      await refreshStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePdf(file) {
    setLoading(true);
    setError("");
    pushMessage("user", `PDF enviado: ${file.name}`);

    try {
      const result = brainStatus?.trained ? await api.analyzePdf(file) : await api.trainPdf(file);
      setCurrentContext(result.response);
      pushMessage("assistant", result.response);
      await refreshStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCleanExpired() {
    setLoading(true);
    setError("");
    try {
      const result = await api.cleanExpired();
      pushMessage("assistant", `${result.archived} memoria(s) expirada(s) foram arquivadas.`);
      await refreshStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Sidebar brainStatus={brainStatus} />
      <div className="workspace">
        <ApiKeyForm config={config} onSubmit={handleSaveKey} loading={loading} />
        <MemoryNotice notice={brainStatus?.retentionNotice} onClean={handleCleanExpired} />
        {error && <div className="error-banner">{error}</div>}
        <ChatWindow messages={messages} disabled={locked} loading={loading} onAsk={handleAsk} onPdf={handlePdf} />
      </div>
    </div>
  );
}
