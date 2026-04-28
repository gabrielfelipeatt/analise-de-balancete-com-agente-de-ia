export function MemoryNotice({ notice, onClean }) {
  if (!notice?.hasExpiredMemories) return null;

  return (
    <div className="memory-notice">
      <div>
        <strong>Memorias antigas encontradas</strong>
        <p>{notice.count} memoria(s) com mais de 3 meses serao arquivadas e nao serao usadas nas proximas respostas.</p>
      </div>
      <button onClick={onClean}>Limpar agora</button>
    </div>
  );
}
