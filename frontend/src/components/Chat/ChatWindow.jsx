import { SendHorizontal } from "lucide-react";
import { PdfUpload } from "../Upload/PdfUpload.jsx";

export function ChatWindow({ messages, disabled, loading, onAsk, onPdf }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    if (!message?.trim()) return;
    onAsk(message.trim());
    event.currentTarget.reset();
  }

  return (
    <main className="chat-shell">
      <div className="chat-header">
        <h1>Agente Contabil</h1>
        <p>Envie PDFs, ensine criterios e analise balancetes fiscais.</p>
      </div>

      <section className="messages">
        {messages.map((message) => (
          <article key={message.id} className={`message ${message.role}`}>
            <div className="message-content">
              <span>{message.role === "user" ? "Voce" : "Agente"}</span>
              <div className={message.role === "user" ? "message-bubble" : ""}>
                <p>{message.content}</p>
              </div>
            </div>
          </article>
        ))}
        {loading && (
          <article className="message assistant">
            <div className="message-content">
              <span>Agente</span>
              <p>Processando...</p>
            </div>
          </article>
        )}
      </section>

      <div className="composer-wrapper">
        <form className="composer" onSubmit={handleSubmit}>
          <PdfUpload disabled={disabled || loading} onFile={onPdf} />
          <input 
            name="message" 
            disabled={disabled || loading} 
            placeholder={disabled ? "Configure a chave para liberar o chat" : "Digite uma pergunta..."} 
            autoComplete="off"
          />
          <button type="submit" aria-label="Enviar" disabled={disabled || loading}>
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}
