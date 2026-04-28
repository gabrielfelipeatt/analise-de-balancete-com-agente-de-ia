import { KeyRound } from "lucide-react";

export function ApiKeyForm({ config, onSubmit, loading }) {
  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit(formData.get("apiKey"));
    event.currentTarget.reset();
  }

  return (
    <form className="api-key-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="apiKey">Chave da API Groq</label>
        <p>A chave fica no backend e nao e salva no brain.</p>
      </div>
      <div className="api-key-row">
        <KeyRound size={18} />
        <input id="apiKey" name="apiKey" type="password" placeholder={config?.maskedKey || "Cole sua chave Groq"} required />
        <button disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
      </div>
    </form>
  );
}
