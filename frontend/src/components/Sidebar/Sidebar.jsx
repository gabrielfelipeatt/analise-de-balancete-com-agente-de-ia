import { MessageSquare, ShieldCheck } from "lucide-react";

export function Sidebar({ brainStatus }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <ShieldCheck size={20} />
        <span>Agente Contabil</span>
      </div>

      <button className="new-chat">
        <MessageSquare size={16} />
        Nova analise
      </button>

      <div className="sidebar-section">
        <span className="section-title">Status</span>
        <div className="status-row">
          <span>Treinamento</span>
          <strong>{brainStatus?.trained ? "Concluido" : "Pendente"}</strong>
        </div>
        <div className="status-row">
          <span>Memorias ativas</span>
          <strong>{brainStatus?.activeMemoriesCount ?? 0}</strong>
        </div>
      </div>
    </aside>
  );
}
