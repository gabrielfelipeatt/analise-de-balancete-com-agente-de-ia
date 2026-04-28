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
        <div>
          <h1>Analise de balancetes fiscais</h1>
          <p>Envie PDFs, ensine criterios e pergunte sobre os dados analisados.</p>
        </div>
      </div>

      <section className="messages">
        {messages.map((message) => (
          <article key={message.id} className={`message ${message.role}`}>
            <span>{message.role === "user" ? "Voce" : "Agente"}</span>
            <p>{message.content}</p>
          </article>
        ))}
        {loading && <article className="message assistant"><span>Agente</span><p>Processando...</p></article>}
      </section>

      <form className="composer" onSubmit={handleSubmit}>
        <PdfUpload disabled={disabled || loading} onFile={onPdf} />
        <input name="message" disabled={disabled || loading} placeholder={disabled ? "Configure e treine o agente para liberar o chat" : "Digite uma pergunta ou ensinamento"} />
        <button aria-label="Enviar" disabled={disabled || loading}>
          <SendHorizontal size={18} />
        </button>
      </form>
    </main>
  );
}
