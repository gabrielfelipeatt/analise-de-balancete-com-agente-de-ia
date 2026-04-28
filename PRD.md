# PRD - Agente de IA para Analise de Balancetes Fiscais

## 1. Visao Geral

O produto e uma aplicacao web de agente de IA especializado em analise de balancetes fiscais. A experiencia deve ser inspirada no ChatGPT, com uma interface limpa, moderna, conversacional e orientada a produtividade.

O usuario podera enviar balancetes fiscais em PDF, ensinar regras e criterios diretamente pelo chat, fazer perguntas sobre os documentos analisados e receber sugestoes de perguntas relevantes para analise contabil e fiscal.

A inteligencia principal da aplicacao sera feita por meio da API da Groq. Antes de usar o agente, o usuario devera informar sua chave de API da Groq. Essa chave devera ser tratada como dado sensivel e armazenada em local seguro, sem exposicao no frontend, logs, arquivos publicos ou na pasta `brain`.

O agente tera uma pasta chamada `brain`, responsavel por armazenar aprendizados extraidos dos PDFs, ensinamentos feitos pelo usuario, resumos, historicos e padroes identificados. As memorias ficarao disponiveis por ate 3 meses. Antes da limpeza de memorias expiradas, o usuario devera receber um aviso claro.

## 2. Objetivos do Produto

- Criar uma aplicacao web conversacional para analise de balancetes fiscais.
- Permitir upload de PDFs de balancetes para leitura, estudo e analise pela IA.
- Permitir que o usuario ensine a IA diretamente pelo chat, sem necessidade de PDF.
- Exigir pelo menos um treinamento inicial antes de liberar as funcoes principais.
- Utilizar a API da Groq como motor de inteligencia artificial.
- Armazenar aprendizados em uma pasta `brain`.
- Manter as memorias por ate 3 meses, com aviso antes da limpeza.
- Gerar perguntas genericas e especificas sobre balancetes fiscais.
- Permitir perguntas livres feitas pelo usuario.
- Melhorar as respostas ao longo do tempo usando memorias validas armazenadas.
- Proteger a chave de API do usuario com boas praticas de seguranca.

## 3. Publico-Alvo

O publico-alvo inicial inclui:

- Analistas contabeis.
- Analistas fiscais.
- Escritorios de contabilidade.
- Consultores tributarios.
- Pequenas e medias empresas que analisam balancetes periodicamente.
- Profissionais que precisam identificar inconsistencias, riscos e variacoes relevantes em balancetes.

## 4. Problema a Ser Resolvido

A analise de balancetes fiscais pode ser repetitiva, demorada e suscetivel a falhas humanas. Analistas precisam verificar variacoes, inconsistencias, saldos atipicos, contas sensiveis, impostos, despesas, receitas e possiveis riscos fiscais.

Muitas vezes, o conhecimento adquirido em analises anteriores fica disperso em conversas, documentos, planilhas ou na memoria individual do profissional. Isso dificulta a reutilizacao de criterios, padroes e aprendizados.

O produto busca resolver esses problemas oferecendo um agente de IA treinavel, capaz de aprender com PDFs e com instrucoes diretas do usuario, mantendo um historico temporario de conhecimento para apoiar analises futuras.

## 5. Solucao Proposta

A solucao sera uma aplicacao web com interface conversacional inspirada no ChatGPT. O usuario informara sua chave de API da Groq, fara um treinamento inicial obrigatorio e, depois disso, podera enviar balancetes em PDF ou ensinar a IA diretamente pelo chat.

O agente devera:

- Extrair texto dos PDFs enviados.
- Interpretar informacoes contabeis e fiscais.
- Criar resumos estruturados dos balancetes.
- Gerar perguntas genericas e especificas.
- Responder perguntas livres do usuario.
- Registrar aprendizados na pasta `brain`.
- Usar memorias validas para melhorar respostas futuras.
- Ignorar memorias expiradas ou removidas.
- Avisar o usuario antes da limpeza de memorias com mais de 3 meses.

## 6. Funcionalidades Principais

### 6.1 Configuracao da Chave Groq

O usuario devera inserir sua chave de API da Groq antes de usar o agente. O sistema devera validar a existencia da chave e impedir o uso das funcoes principais caso ela nao esteja configurada.

### 6.2 Treinamento Inicial Obrigatorio

Antes de liberar analises, perguntas e chat avancado, o sistema deve exigir pelo menos um treinamento inicial. Esse treinamento podera ser feito por:

- Upload de PDF de balancete.
- Mensagem direta no chat com regras, criterios, exemplos ou instrucoes.

### 6.3 Upload de Balancete em PDF

O usuario podera enviar arquivos PDF contendo balancetes fiscais. O sistema devera extrair o conteudo, organizar os dados relevantes, enviar contexto para a Groq e armazenar aprendizados na pasta `brain`.

### 6.4 Ensino Direto Pelo Chat

O usuario podera ensinar regras e criterios para a IA diretamente pelo chat. O agente devera identificar mensagens de ensinamento, confirmar entendimento e salvar o aprendizado na pasta `brain`.

### 6.5 Geracao de Perguntas

Apos o upload de um PDF, o sistema devera mostrar tres tipos de perguntas:

- Tipo 1: perguntas genericas que todo analista faria.
- Tipo 2: perguntas especificas baseadas no conteudo real do PDF.
- Tipo 3: campo para pergunta livre do usuario.

### 6.6 Brain

A pasta `brain` sera o repositorio local de memorias e aprendizados do agente. Ela devera armazenar informacoes estruturadas, com data de criacao, origem, validade e data de expiracao.

### 6.7 Retencao de Memorias

As memorias serao mantidas por ate 3 meses. O sistema devera identificar memorias expiradas, avisar o usuario antes da limpeza e impedir o uso de memorias expiradas em novas respostas.

## 7. Fluxos do Usuario

### 7.1 Primeiro Acesso

1. Usuario acessa a aplicacao.
2. Sistema exibe tela inicial com campo para chave da API Groq.
3. Usuario informa a chave.
4. Sistema valida se a chave foi preenchida.
5. Sistema solicita treinamento inicial obrigatorio.

### 7.2 Insercao Segura da Chave da API Groq

1. Usuario informa a chave no campo seguro.
2. Frontend envia a chave ao backend por conexao segura.
3. Backend armazena a chave em local protegido.
4. Sistema nunca salva a chave na pasta `brain`.
5. Sistema mascara a chave na interface.
6. Logs nao devem registrar a chave.

### 7.3 Treinamento Inicial Via PDF

1. Usuario seleciona a opcao de treinamento por PDF.
2. Usuario envia um PDF de balancete.
3. Sistema extrai o texto do PDF.
4. Sistema envia o conteudo para analise pela Groq.
5. IA gera resumo, padroes e aprendizados iniciais.
6. Sistema salva memoria na pasta `brain`.
7. Sistema marca o agente como treinado.
8. Funcoes principais sao liberadas.

### 7.4 Treinamento Inicial Via Chat

1. Usuario seleciona a opcao de ensinar pelo chat.
2. Usuario envia uma regra, criterio, exemplo ou instrucao.
3. Sistema identifica a mensagem como ensinamento.
4. IA confirma o entendimento.
5. Sistema salva o aprendizado na pasta `brain`.
6. Sistema marca o agente como treinado.
7. Funcoes principais sao liberadas.

### 7.5 Upload de Novo Balancete

1. Usuario envia novo PDF.
2. Sistema valida tipo e tamanho do arquivo.
3. Sistema extrai texto do PDF.
4. Sistema consulta memorias validas da pasta `brain`.
5. Sistema envia contexto para a Groq.
6. Agente gera resumo e pontos de atencao.
7. Sistema atualiza a pasta `brain`.
8. Sistema mostra perguntas genericas, especificas e campo de pergunta livre.

### 7.6 Pergunta Livre no Chat

1. Usuario digita uma pergunta.
2. Sistema recupera o contexto do PDF atual.
3. Sistema recupera memorias validas relevantes.
4. Sistema envia pergunta e contexto para a Groq.
5. Agente responde de forma clara, indicando pontos de atencao.
6. Sistema registra a pergunta e, se relevante, a resposta na pasta `brain`.

### 7.7 Usuario Ensinando a IA Durante a Conversa

1. Usuario envia uma mensagem com instrucao ou regra.
2. Sistema classifica a mensagem como possivel ensinamento.
3. Agente confirma o entendimento.
4. Sistema salva a memoria com origem `chat`.
5. Sistema registra data de criacao e expiracao.
6. Aprendizado passa a ser usado em analises futuras enquanto estiver valido.

### 7.8 Aviso e Limpeza de Memorias

1. Sistema verifica memorias com mais de 3 meses.
2. Sistema exibe aviso ao usuario antes da limpeza.
3. Aviso informa que memorias antigas serao removidas ou arquivadas.
4. Usuario visualiza os tipos de memoria afetados.
5. Sistema executa a limpeza conforme regra definida.
6. Pasta `brain` e atualizada.
7. Memorias expiradas deixam de ser usadas em respostas.

### 7.9 Consulta a Analises Anteriores

1. Usuario acessa historico na sidebar.
2. Sistema lista conversas e analises disponiveis.
3. Sistema mostra somente memorias validas, ou marca memorias expiradas como indisponiveis.
4. Usuario pode abrir uma analise anterior para consulta.

## 8. Requisitos Funcionais

### RF-001 - Interface Inspirada no ChatGPT

A aplicacao deve possuir layout com sidebar lateral, area principal de conversa, campo de mensagem, upload de arquivos e historico de conversas ou analises.

### RF-002 - Campo de Chave Groq

A aplicacao deve solicitar a chave da API Groq antes de liberar as funcionalidades principais.

### RF-003 - Bloqueio Sem Chave

O sistema deve bloquear upload, treinamento, perguntas e chat avancado enquanto a chave da API Groq nao estiver configurada.

### RF-004 - Armazenamento Seguro da Chave

A chave da API deve ser armazenada em local seguro, preferencialmente no backend, usando variaveis de ambiente, cofre de segredos, criptografia ou mecanismo equivalente.

### RF-005 - Treinamento Inicial Obrigatorio

O sistema deve exigir pelo menos um treinamento inicial antes de liberar as funcoes principais.

### RF-006 - Treinamento Por PDF

O sistema deve permitir que o treinamento inicial seja feito por upload de PDF de balancete.

### RF-007 - Treinamento Por Chat

O sistema deve permitir que o treinamento inicial seja feito por ensinamento direto no chat.

### RF-008 - Upload de PDF

O sistema deve aceitar arquivos PDF de balancetes e rejeitar formatos nao suportados.

### RF-009 - Extracao de Texto do PDF

O backend deve extrair texto dos PDFs enviados para posterior analise pela IA.

### RF-010 - Analise de Balancete

O agente deve identificar informacoes contabeis e fiscais relevantes, como contas, saldos, variacoes, impostos, despesas, receitas, inconsistencias e possiveis riscos.

### RF-011 - Perguntas Genericas

Apos o upload de um PDF, o agente deve gerar perguntas genericas aplicaveis a qualquer balancete.

### RF-012 - Perguntas Especificas

Apos o upload de um PDF, o agente deve gerar perguntas especificas baseadas no conteudo real do documento.

### RF-013 - Pergunta Livre

O usuario deve poder fazer perguntas livres no chat sobre o PDF atual, memorias validas e contexto da conversa.

### RF-014 - Brain

O sistema deve criar e manter uma pasta `brain` para armazenar aprendizados e memorias do agente.

### RF-015 - Registro de Metadados da Memoria

Cada memoria deve conter data de criacao, data de expiracao, origem, tipo, resumo e conteudo estruturado.

### RF-016 - Retencao de 3 Meses

Memorias devem ser mantidas por ate 3 meses a partir da data de criacao.

### RF-017 - Aviso Antes da Limpeza

O usuario deve receber aviso antes da limpeza de memorias expiradas.

### RF-018 - Ignorar Memorias Expiradas

O agente nao deve usar memorias expiradas em novas respostas.

### RF-019 - Historico na Sidebar

A sidebar deve exibir conversas, analises e treinamentos disponiveis.

### RF-020 - Estados Visuais

A interface deve exibir estados de carregamento, erro, sucesso, treinamento concluido, arquivo processado, memoria atualizada e aviso de limpeza.

## 9. Requisitos Nao Funcionais

- A interface deve ser responsiva para desktop, tablet e mobile.
- A experiencia deve ser clara, rapida e semelhante a um chat moderno.
- A aplicacao deve proteger dados sensiveis do usuario.
- A chave da API nao deve aparecer em logs, console, respostas da IA ou arquivos publicos.
- O processamento de PDFs deve ter performance aceitavel para arquivos comuns de balancete.
- O sistema deve registrar logs basicos de auditoria sem dados sensiveis.
- O codigo deve ser modular e facil de manter.
- A pasta `brain` deve ter estrutura organizada e legivel.
- As respostas da IA devem ser claras, profissionais e voltadas ao contexto contabil/fiscal.
- O sistema deve tratar erros de PDF invalido, chave ausente, falha na API da Groq e falha de leitura/escrita no `brain`.
- O sistema deve preservar a privacidade dos dados enviados pelo usuario.

## 10. Arquitetura Tecnica Sugerida

### 10.1 Frontend

Responsavel pela interface web, incluindo:

- Layout estilo ChatGPT.
- Sidebar com historico.
- Area de conversa.
- Campo de mensagem.
- Upload de PDF.
- Tela de configuracao da chave Groq.
- Exibicao dos tres tipos de perguntas.
- Avisos de memoria expirada.
- Estados de carregamento e erro.

Tecnologias sugeridas:

- React, Next.js ou Vite.
- Tailwind CSS ou CSS modular.
- Componentes reutilizaveis para chat, sidebar, modal e upload.

### 10.2 Backend

Responsavel por:

- Receber PDFs.
- Extrair texto dos PDFs.
- Comunicar com a API da Groq.
- Gerenciar a pasta `brain`.
- Proteger a chave de API.
- Criar, consultar e limpar memorias.
- Aplicar regras de treinamento inicial.
- Registrar logs de auditoria sem dados sensiveis.

Tecnologias sugeridas:

- Node.js com Express ou Fastify.
- Python com FastAPI.
- Biblioteca de extracao de PDF, como pdf-parse, PyMuPDF ou pdfplumber.

### 10.3 Camada de IA

Responsavel por:

- Preparar prompts para a Groq.
- Enviar contexto do PDF e memorias validas.
- Classificar mensagens como pergunta, ensinamento ou comando.
- Gerar resumos, perguntas e respostas.
- Retornar respostas estruturadas ao backend.

### 10.4 Persistencia Local

No MVP, a pasta `brain` pode funcionar como armazenamento local em arquivos JSON ou Markdown estruturado. Em evolucoes futuras, pode ser substituida ou complementada por banco de dados e armazenamento vetorial.

## 11. Estrutura de Pastas Sugerida

```text
agente-contabil/
  frontend/
    src/
      components/
        Chat/
        Sidebar/
        Upload/
        ApiKeyForm/
        MemoryNotice/
      pages/
      styles/
      services/
  backend/
    src/
      api/
      services/
        groqService.js
        pdfService.js
        brainService.js
        memoryRetentionService.js
        trainingService.js
      controllers/
      middlewares/
      utils/
      config/
    uploads/
    logs/
  brain/
    memories/
      pdf/
      chat/
      analysis/
    summaries/
    indexes/
    retention/
    brain-index.json
  .env
  .env.example
  README.md
  PRD.md
```

### 11.1 Exemplo de Memoria em JSON

```json
{
  "id": "mem_2026_04_27_001",
  "type": "chat_teaching",
  "origin": "chat",
  "created_at": "2026-04-27T10:00:00-03:00",
  "expires_at": "2026-07-27T10:00:00-03:00",
  "status": "active",
  "summary": "Considerar variacoes acima de 20% como relevantes.",
  "content": {
    "rule": "Sempre considerar variacoes superiores a 20% como relevantes na analise de balancetes.",
    "category": "criterio_analise"
  }
}
```

## 12. Integracao com Groq

A integracao com a Groq deve ser feita exclusivamente pelo backend. O frontend nao deve chamar a Groq diretamente com a chave do usuario.

### Requisitos da Integracao

- Receber a chave de API do usuario de forma segura.
- Validar a presenca da chave antes de executar chamadas.
- Montar prompts com contexto do PDF, memorias validas e pergunta do usuario.
- Enviar solicitacoes para a API da Groq.
- Tratar erros de autenticacao, limite de uso, timeout e indisponibilidade.
- Remover dados sensiveis dos logs.
- Nunca incluir a chave em mensagens para a IA.

### Tipos de Prompts Necessarios

- Prompt de treinamento inicial por PDF.
- Prompt de treinamento inicial por chat.
- Prompt de extracao de aprendizados.
- Prompt de geracao de perguntas genericas.
- Prompt de geracao de perguntas especificas.
- Prompt de resposta a pergunta livre.
- Prompt de classificacao de mensagem como pergunta ou ensinamento.
- Prompt de resumo para salvar no `brain`.

## 13. Funcionamento da Pasta `brain`

A pasta `brain` sera o repositorio de memorias do agente. Ela deve funcionar como um cerebro persistente e temporario.

### Dados Armazenados

- Resumos de PDFs enviados.
- Informacoes contabeis e fiscais extraidas.
- Perguntas feitas pelo usuario.
- Respostas importantes.
- Ensinamentos feitos pelo chat.
- Padroes identificados.
- Regras de analise.
- Historico de treinamentos.
- Metadados de criacao e expiracao.
- Origem da memoria.

### Uso nas Respostas

Antes de responder, o backend deve:

1. Identificar o contexto da conversa.
2. Buscar memorias ativas e relevantes.
3. Ignorar memorias expiradas.
4. Montar contexto para a Groq.
5. Registrar novos aprendizados se houver.

### O Que Nao Deve Ser Armazenado no `brain`

- Chave da API Groq em texto puro.
- Segredos de ambiente.
- Tokens de sessao.
- Senhas.
- Dados que o usuario solicitou remover.
- Logs tecnicos sensiveis.

## 14. Retencao e Limpeza de Memorias

As memorias devem permanecer guardadas por 3 meses a partir da data de criacao.

### Regras de Retencao

- Toda memoria deve ter `created_at`.
- Toda memoria deve ter `expires_at`.
- A data `expires_at` deve ser 3 meses apos `created_at`.
- Memorias vencidas nao devem ser usadas em respostas.
- O usuario deve receber aviso antes da limpeza.
- Apos a limpeza, o indice do `brain` deve ser atualizado.

### Aviso de Limpeza

O aviso deve informar:

- Que existem memorias com mais de 3 meses.
- Que elas serao limpas ou arquivadas.
- Quais tipos de memoria serao afetados.
- Que memorias expiradas nao serao usadas em novas respostas.

### Politica do MVP

Para o MVP, a recomendacao e:

- Exibir aviso ao usuario quando houver memorias expiradas.
- Permitir confirmacao da limpeza.
- Mover memorias expiradas para uma pasta `brain/retention/expired/` ou remove-las definitivamente, conforme configuracao.
- Garantir que memorias arquivadas tambem nao sejam usadas no contexto ativo.

## 15. Seguranca da Chave de API

A chave da API Groq e um dado sensivel e deve ser protegida.

### Regras Obrigatorias

- A chave nao pode ser salva na pasta `brain`.
- A chave nao pode aparecer em logs.
- A chave nao pode aparecer em respostas da IA.
- A chave nao pode ficar exposta no frontend.
- A chave deve ser mascarada na interface.
- O backend deve ser responsavel pelas chamadas para a Groq.

### Armazenamento Recomendado

Para o MVP:

- Usar variavel de ambiente local quando a aplicacao for de usuario unico.
- Usar armazenamento criptografado no backend quando houver multiplos usuarios.
- Usar cofre de segredos em ambiente de producao.

### Cuidados Adicionais

- Sanitizar logs.
- Evitar salvar payloads completos contendo dados sensiveis.
- Usar HTTPS em producao.
- Definir timeout para chamadas externas.
- Tratar erros sem expor detalhes internos.

## 16. Ensino da IA Pelo Chat

O usuario podera ensinar a IA usando mensagens diretas no chat. Esse recurso serve para registrar criterios, preferencias, regras contabeis e orientacoes de analise.

### Exemplos de Ensinamento

- "Sempre considere variacoes acima de 20% como relevantes."
- "Ao analisar impostos, verifique ICMS, PIS, COFINS e IRPJ separadamente."
- "Quando encontrar saldo negativo em conta de ativo, marque como possivel inconsistencia."
- "Use este padrao de analise para empresas do Simples Nacional."
- "Priorize riscos fiscais antes de comentarios gerenciais."

### Comportamento Esperado

1. Sistema identifica que a mensagem contem ensinamento.
2. Agente confirma o entendimento.
3. Usuario recebe retorno objetivo.
4. Sistema salva memoria no `brain`.
5. Memoria recebe data de criacao e expiracao.
6. Ensinamento passa a ser usado em respostas futuras enquanto estiver valido.

### Confirmacao ao Usuario

Exemplo de confirmacao:

"Entendido. Vou considerar variacoes acima de 20% como relevantes nas proximas analises enquanto essa memoria estiver valida."

## 17. Regras de Negocio

- O usuario nao pode usar o agente sem configurar a chave da API Groq.
- O usuario nao pode acessar funcoes principais antes do treinamento inicial.
- O treinamento inicial pode ser feito por PDF ou chat.
- Todo PDF enviado deve gerar aprendizado ou registro de analise no `brain`.
- Toda memoria deve possuir data de criacao e data de expiracao.
- Memorias expiram apos 3 meses.
- Memorias expiradas nao devem ser usadas em respostas.
- O usuario deve receber aviso antes da limpeza de memorias expiradas.
- A chave da API Groq nunca deve ser salva em texto puro no `brain`.
- Perguntas especificas devem ser baseadas no conteudo real do PDF enviado.
- Perguntas genericas devem refletir boas praticas de analise de balancetes.
- O agente deve responder com foco contabil/fiscal, evitando respostas genericas quando houver contexto disponivel.
- O agente deve informar quando nao houver dados suficientes para uma conclusao.
- O sistema deve registrar ensinamentos feitos pelo usuario como memorias de origem `chat`.

## 18. Criterios de Aceite

- O usuario nao consegue usar o agente sem inserir a chave da API Groq.
- A chave da API Groq nao e salva em texto puro na pasta `brain`.
- O frontend nao chama diretamente a API da Groq com a chave do usuario.
- O usuario nao consegue acessar funcoes principais antes do treinamento inicial.
- O treinamento inicial pode ser feito via PDF.
- O treinamento inicial pode ser feito via chat.
- O sistema aceita upload de PDF de balancete.
- O sistema rejeita arquivos que nao sejam PDF.
- O sistema extrai texto do PDF enviado.
- O usuario consegue ensinar a IA pelo chat.
- O agente registra ensinamentos feitos pelo usuario na pasta `brain`.
- O agente gera perguntas genericas.
- O agente gera perguntas especificas com base no PDF.
- O usuario consegue fazer perguntas livres.
- A pasta `brain` e criada e atualizada.
- Cada memoria possui data de criacao.
- Cada memoria possui data de expiracao.
- Memorias sao mantidas por ate 3 meses.
- O usuario recebe aviso antes da limpeza de memorias antigas.
- O agente usa apenas memorias validas para melhorar respostas futuras.
- Memorias expiradas nao sao incluidas no contexto enviado a Groq.
- A interface apresenta estados de carregamento, erro e sucesso.
- A sidebar permite consultar historico de conversas e analises disponiveis.

## 19. Riscos e Pontos de Atencao

### 19.1 Qualidade da Extracao de PDF

PDFs podem conter tabelas complexas, imagens ou texto escaneado. Caso o PDF seja escaneado, pode ser necessario OCR.

### 19.2 Confiabilidade das Respostas

A IA pode interpretar incorretamente dados contabeis. O sistema deve deixar claro que as respostas sao apoio analitico e nao substituem revisao profissional.

### 19.3 Privacidade e Dados Sensiveis

Balancetes podem conter informacoes financeiras sensiveis. O sistema deve evitar exposicao indevida e armazenar apenas o necessario.

### 19.4 Seguranca da Chave de API

A chave da Groq nao pode vazar por logs, frontend, historico, pasta `brain` ou mensagens da IA.

### 19.5 Crescimento da Pasta `brain`

Mesmo com retencao de 3 meses, a pasta pode crescer. O sistema deve ter limpeza, indexacao e organizacao.

### 19.6 Memorias Desatualizadas

Memorias antigas podem gerar respostas incorretas. Por isso, o uso deve ser limitado a memorias validas.

### 19.7 Limites da API Groq

O sistema deve tratar limites de taxa, timeout, indisponibilidade e erros de autenticacao.

## 20. Roadmap MVP

### Fase 1 - Base da Aplicacao

- Criar estrutura frontend e backend.
- Criar layout de chat inspirado no ChatGPT.
- Criar sidebar com historico basico.
- Criar campo de chave Groq.
- Criar validacao de chave informada.

### Fase 2 - Treinamento Inicial

- Implementar bloqueio das funcoes antes do treinamento.
- Implementar treinamento via PDF.
- Implementar treinamento via chat.
- Criar registro inicial na pasta `brain`.

### Fase 3 - Analise de PDF

- Implementar upload de PDF.
- Implementar extracao de texto.
- Integrar analise com Groq.
- Gerar resumo do balancete.
- Gerar perguntas genericas e especificas.

### Fase 4 - Chat e Aprendizado

- Implementar perguntas livres.
- Recuperar memorias validas do `brain`.
- Registrar perguntas, respostas importantes e ensinamentos.
- Confirmar ensinamentos detectados no chat.

### Fase 5 - Retencao de Memoria

- Adicionar `created_at` e `expires_at` em todas as memorias.
- Implementar verificacao de memorias expiradas.
- Criar aviso antes da limpeza.
- Implementar limpeza ou arquivamento.

### Fase 6 - Refinamento

- Melhorar estados visuais.
- Melhorar tratamento de erros.
- Sanitizar logs.
- Criar documentacao tecnica.
- Validar criterios de aceite.

## 21. Melhorias Futuras

- Suporte a OCR para PDFs escaneados.
- Banco de dados para usuarios, sessoes e memorias.
- Banco vetorial para busca semantica de memorias.
- Painel de memorias para revisar, editar ou excluir aprendizados.
- Controle de permissoes por usuario ou empresa.
- Exportacao de relatorios em PDF ou Excel.
- Comparacao automatica entre balancetes de periodos diferentes.
- Alertas de riscos fiscais com severidade.
- Integracao com sistemas contabeis.
- Suporte a multiplos modelos da Groq.
- Criptografia de memorias sensiveis.
- Auditoria detalhada de acessos e alteracoes.
- Configuracao customizada do prazo de retencao.
- Templates de analise por regime tributario.
- Modo de revisao humana antes de salvar ensinamentos no `brain`.
