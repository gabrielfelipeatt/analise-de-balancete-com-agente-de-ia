import { Trash2 } from "lucide-react";

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
        <label htmlFor="apiKey">Configuracao Gemini</label>
        <p>{hasKey ? `Chave ativa: ${config.maskedKey}` : "Insira sua chave para iniciar"}</p>
      </div>
      <div className="api-key-row">
        <input 
          id="apiKey" 
          name="apiKey" 
          type="password" 
          placeholder={hasKey ? "Substituir chave..." : "Cole sua chave..."} 
          required={!hasKey} 
          autoComplete="off"
        />
        <button disabled={loading}>{loading ? "..." : "Salvar"}</button>
        {hasKey && (
          <button className="danger-button" type="button" title="Remover chave" onClick={onRemove} disabled={loading}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
