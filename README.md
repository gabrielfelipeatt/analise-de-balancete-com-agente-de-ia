# Agente Contabil

Aplicacao web para analise de balancetes fiscais com IA, baseada no `PRD.md`.

## Estrutura

- `frontend/`: interface estilo ChatGPT com chat, sidebar, upload e avisos.
- `backend/`: API Express para Google Gemini, PDF, treinamento e memorias.
- `brain/`: memorias temporarias do agente, com retencao de 3 meses.
- `PRD.md`: documento de produto.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o `.env` a partir de `.env.example`, se quiser ajustar porta, origem do frontend, modelo ou retencao de memorias.

3. Rode backend e frontend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3333`

## Modelo Google Gemini

O modelo padrao configurado no projeto e:

```env
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-2.5-flash-lite
GEMINI_MAX_RETRIES=2
GEMINI_RETRY_BASE_DELAY_MS=1500
```

A aplicacao tenta novamente quando o Gemini retorna erro temporario de alta demanda, limite ou instabilidade. Se o modelo principal continuar falhando, o backend tenta automaticamente o modelo fallback.

A chave do Google Gemini e informada pela interface do sistema.

## Seguranca

A chave do Google Gemini deve ser enviada pela interface, fica no backend e nao e salva na pasta `brain`. Ela e persistida localmente em `backend/.secure/` de forma criptografada para que o usuario nao precise digita-la toda vez que iniciar a aplicacao. A interface tambem permite remover a chave salva e cadastrar outra.
