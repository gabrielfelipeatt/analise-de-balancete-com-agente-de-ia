import { KeyRound, Trash2 } from "lucide-react";

export function ApiKeyForm({ config, onSubmit, onRemove, loading }) {
  const hasKey = Boolean(config?.hasGeminiApiKey);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(formData.get("apiKey"));
    event.currentTarget.reset();
  }

  return (
    <form className="api-key-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="apiKey">Chave da API Google Gemini</label>
        <p>{hasKey ? `Chave salva: ${config.maskedKey}` : "Informe a chave uma vez para liberar o agente."}</p>
      </div>
      <div className="api-key-row">
        <KeyRound size={18} />
        <input id="apiKey" name="apiKey" type="password" placeholder={hasKey ? "Cole uma nova chave para substituir" : "Cole sua chave Gemini"} required={!hasKey} />
        <button disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
        {hasKey && (
          <button className="danger-button" type="button" title="Remover chave salva" onClick={onRemove} disabled={loading}>
            <Trash2 size={16} />
            Remover
          </button>
        )}
      </div>
    </form>
  );
}
