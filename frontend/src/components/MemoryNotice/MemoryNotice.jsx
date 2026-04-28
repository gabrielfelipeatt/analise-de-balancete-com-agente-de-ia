export function MemoryNotice({ notice, onClean }) {
  if (!notice?.hasExpiredMemories) return null;

  return (
    <div className="memory-notice">
      <p><strong>Memorias antigas:</strong> {notice.count} item(s) expirados serao arquivados.</p>
      <button onClick={onClean}>Limpar Memorias</button>
    </div>
  );
}
