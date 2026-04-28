export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const message = status === 500 ? "Erro interno do servidor." : error.message;

  if (status === 500) {
    console.error("Internal error:", error.message);
  }

  res.status(status).json({ error: message });
}
