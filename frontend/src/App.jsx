import { useEffect, useMemo, useState } from "react";
import { ApiKeyForm } from "./components/ApiKeyForm/ApiKeyForm.jsx";
import { ChatWindow } from "./components/Chat/ChatWindow.jsx";
import { MemoryNotice } from "./components/MemoryNotice/MemoryNotice.jsx";
import { Sidebar } from "./components/Sidebar/Sidebar.jsx";
import { api } from "./services/api.js";

export function App() {
  const [config, setConfig] = useState(null);
  const [brainStatus, setBrainStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentContext, setCurrentContext] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const locked = useMemo(() => !config?.hasGeminiApiKey, [config]);

  const welcomeMessage = useMemo(() => {
    if (config?.hasGeminiApiKey) {
      return "Olá! Chave Gemini configurada. Como posso ajudar com seus balancetes hoje?";
    }
    return "Configure a chave Google Gemini para começar.";
  }, [config]);

  useEffect(() => {
    if (messages.length === 0 && config) {
      setMessages([{ id: "welcome", role: "assistant", content: welcomeMessage }]);
    }
  }, [config, welcomeMessage]);

  async function refreshStatus() {
    const [configData, brainData] = await Promise.all([api.getConfig(), api.getBrainStatus()]);
    setConfig(configData);
    setBrainStatus(brainData);
  }

  useEffect(() => {
    refreshStatus().catch((err) => setError(err.message));
  }, []);

  async function handleSelectConversation(id) {
    if (!id) {
      setCurrentConversationId(null);
      setMessages([{ id: "welcome", role: "assistant", content: welcomeMessage }]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getConversations();
      const conv = data.conversations.find(c => c.id === id);
      if (conv) {
        setCurrentConversationId(id);
        setMessages(conv.messages || []);
      }
    } catch (err) {
      setError("Erro ao carregar conversa.");
    } finally {
      setLoading(false);
    }
  }

  async function pushMessage(role, content) {
    const newMessage = { id: crypto.randomUUID(), role, content };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    if (currentConversationId) {
      try {
        await api.updateConversation(currentConversationId, { messages: updatedMessages });
      } catch (err) {
        console.error("Erro ao salvar mensagem na conversa:", err);
      }
    }
  }

  async function handleSaveKey(apiKey) {
    if (!apiKey?.trim()) return;

    setLoading(true);
    setError("");
    try {
      const data = await api.saveGeminiKey(apiKey);
      setConfig(data);
      pushMessage("assistant", "Chave Google Gemini configurada com sucesso!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveKey() {
    setLoading(true);
    setError("");
    try {
      const data = await api.removeGeminiKey();
      setConfig(data);
      pushMessage("assistant", "Chave Google Gemini removida. Informe uma nova chave para continuar.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk(message) {
    setLoading(true);
    setError("");
    await pushMessage("user", message);

    try {
      const result = await api.ask(message, currentContext);
      await pushMessage("assistant", result.response);
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
    await pushMessage("user", `Arquivo PDF enviado para análise: ${file.name}`);

    try {
      const result = await api.analyzePdf(file);
      setCurrentContext(result.response);
      await pushMessage("assistant", result.response);
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
      await pushMessage("assistant", `${result.archived} memória(s) expirada(s) foram arquivadas.`);
      await refreshStatus();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Sidebar 
        brainStatus={brainStatus} 
        onSelectConversation={handleSelectConversation}
        currentConversationId={currentConversationId}
      />
      <div className="workspace">
        <ApiKeyForm config={config} onSubmit={handleSaveKey} onRemove={handleRemoveKey} loading={loading} />
        <MemoryNotice notice={brainStatus?.retentionNotice} onClean={handleCleanExpired} />
        {error && <div className="error-banner">{error}</div>}
        <ChatWindow messages={messages} disabled={locked} loading={loading} onAsk={handleAsk} onPdf={handlePdf} />
      </div>
    </div>
  );
}
