# Agente Contabil

Aplicacao web para analise de balancetes fiscais com IA, baseada no `PRD.md`.

## Estrutura

- `frontend/`: interface estilo ChatGPT com chat, sidebar, upload e avisos.
- `backend/`: API Express para Groq, PDF, treinamento e memorias.
- `brain/`: memorias temporarias do agente, com retencao de 3 meses.
- `PRD.md`: documento de produto.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o `.env` a partir de `.env.example`.

3. Rode backend e frontend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:3333`

## Modelo Groq

O modelo padrao configurado no projeto e:

```env
GROQ_MODEL=llama-3.3-70b-versatile
```

Se voce criou um arquivo `.env`, confira se ele nao esta usando um modelo antigo como `llama-3.1-70b-versatile`, pois esse modelo foi descontinuado pela Groq.

## Seguranca

A chave da Groq deve ser enviada para o backend e mantida fora da pasta `brain`. O MVP tambem permite usar `GROQ_API_KEY` no `.env`.
