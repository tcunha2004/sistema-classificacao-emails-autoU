# sistema-classificacao-emails-autoU

Solução full‑stack para classificar e-mails recebidos (Produtivo | Improdutivo) e sugerir uma resposta automática, com backend em Python/Flask, frontend em React/TypeScript (Vite) e orquestração via Docker Compose.

## Visão geral

- Objetivo: ajudar equipes que lidam com alto volume de e-mails a identificar rapidamente a natureza da mensagem e responder mais rápido com uma sugestão inicial.
- Como funciona:
  1.  No frontend, você digita o texto do e-mail (ou envia um arquivo .txt/.pdf).
  2.  O backend envia esse conteúdo para a API da OpenAI, solicitando classificação e uma resposta sugerida.
  3.  O resultado é apresentado em um modal com a classificação e a sugestão pronta para copiar.

## Stacks e arquitetura

- Backend (container: `email-classifier-backend`)

  - Python 3.11 (imagem slim)
  - Flask + Flask-CORS
  - OpenAI Python SDK (chat/completions)
  - Porta interna: 5000 (exposta no host como 5001 via Docker Compose)

- Frontend (container: `email-classifier-frontend`)

  - React 19 + TypeScript
  - Vite 7
  - styled-components, axios, pdfjs-dist (extração de texto de PDFs não digitalizados pode ser limitada)
  - Servido por Nginx no container (porta 80 → host 5173)

- Infra
  - Docker e Docker Compose (bridge network `appnet`)
  - Nginx faz proxy das chamadas `GET/POST /api/*` para o backend (`backend:5000`)

Arquitetura em alto nível:

- Navegador → Frontend (Nginx) → `proxy_pass` para Backend em `/api/*` → OpenAI API

## Estrutura do repositório (resumo)

- `backend-python/`
  - `app.py` e `routes.py`: app Flask e rota `POST /classificar-texto`
  - `askOpenAI.py`: integração com OpenAI (modelo, temperatura, parsing do JSON)
  - `main.py`: bootstrap do servidor Flask (host 0.0.0.0, porta via env `PORT`)
  - `Dockerfile` e `requirements.txt`
- `frontend-react/sistema-classificacao-emails/`
  - `src/` (React + TS)
  - `src/lib/axios.ts`: `baseURL` via `VITE_API_BASE_URL` ou fallback `/api`
  - `Dockerfile` (build com Node; runtime com Nginx que proxyfies `/api/`)
- `docker-compose.yml`: sobe os 2 serviços, portas e variáveis

## Endpoints (contrato de API)

- `POST /classificar-texto`
  - Corpo: JSON `{ "text": "conteúdo do e‑mail" }` ou form-data (`text`)
  - Resposta (200): `{ "classificacao": "Produtivo"|"Improdutivo", "resposta": "<sugestão>" }`
  - Erros:
    - 400: campo `text` ausente
    - 502: erro de comunicação ou formato inesperado do modelo

## Pré-requisitos

- macOS, Linux ou Windows com suporte a Docker
- Docker Desktop (ou Docker Engine) com Docker Compose v2
- Uma chave de API válida da OpenAI com acesso ao modelo configurado (`gpt-4o-mini` por padrão)

## Rodando com Docker (recomendado)

1. Crie um arquivo `.env` na raiz do projeto com a sua chave:

```
OPENAI_API_KEY=coloque_sua_chave_aqui
```

2. Suba os serviços (primeira vez inclui build):

```
docker compose up -d --build
```

3. Acesse o frontend em:

- http://localhost:5173

4. O backend ficará disponível (via proxy Nginx) em `/api`. Se quiser chamar direto o backend:

- http://localhost:5001/classificar-texto

5. Logs e desligar:

```
docker compose logs -f           # acompanhar logs
docker compose down              # parar e remover containers
```

Observações:

- No Compose, o backend expõe a porta interna 5000 como 5001 no host. O frontend Nginx escuta na 80 do container e mapeia para 5173 no host.
- O frontend já faz proxy de `/api/*` → `backend:5000`; não é necessário configurar `VITE_API_BASE_URL` quando rodando via Docker.

## Configurando sua própria API key

Opção A — Recomendado (variável de ambiente):

- O backend lê `OPENAI_API_KEY` do ambiente (ver `backend-python/askOpenAI.py`).
- Defina no `.env` da raiz (Docker Compose já injeta `OPENAI_API_KEY=${OPENAI_API_KEY}` no serviço `backend`).
- Para desenvolvimento local sem Docker, exporte no shell:

```
export OPENAI_API_KEY="coloque_sua_chave_aqui"
```

Opção B — Diretamente no código (menos seguro):

- Edite `backend-python/askOpenAI.py` e substitua a criação do cliente por:

```python
from openai import OpenAI
_client = OpenAI(api_key="coloque_sua_chave_aqui")
```

Nota: manter a chave em variáveis de ambiente é a prática recomendada, especialmente em produção.

## Execução em desenvolvimento (sem Docker) — opcional

Backend:

```
cd backend-python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY="coloque_sua_chave_aqui"
python main.py   # inicia em 0.0.0.0:5000
```

Frontend:

```
cd frontend-react/sistema-classificacao-emails
npm ci || npm install
npm run dev  # Vite em http://localhost:5173
```

Se NÃO for usar o proxy do Nginx (i.e., sem Docker), defina `VITE_API_BASE_URL` apontando para o backend local:

```
echo 'VITE_API_BASE_URL="http://localhost:5000"' > .env.local
```

## Variáveis de ambiente suportadas

- Backend
  - `OPENAI_API_KEY` (obrigatória)
  - `PORT` (opcional, padrão 5000)
  - `FLASK_ENV` (opcional, ex.: `production`)
- Frontend
  - `VITE_API_BASE_URL` (opcional; quando não definida, usa `/api`)

## Ajustes de modelo e parâmetros

- Arquivo: `backend-python/askOpenAI.py`
  - Modelo: `model="gpt-4o-mini"` (você pode trocar por outro modelo compatível)
  - Temperatura: `temperature=0` (pode ajustar conforme o nível de criatividade desejado)
  - O sistema força `response_format={"type": "json_object"}` e valida o JSON.

## Limitações conhecidas

- PDFs digitalizados (imagens) podem não ter o texto extraído — `pdfjs-dist` não faz OCR. Para esses casos, forneça um `.txt` ou um PDF pesquisável.
- A resposta depende do modelo e pode variar; tratamos retornos inválidos como erro 502.

## Solução de problemas

- 401/429 ou 502 ao classificar:
  - Verifique se `OPENAI_API_KEY` está correta e com permissões ativas para o modelo em uso.
  - Confirme conectividade de rede do container do backend para a OpenAI.
- CORS: o backend já habilita CORS via `flask-cors`. No Docker, o frontend acessa via Nginx + proxy, evitando problemas de origem.
- Frontend carrega mas API falha:
  - Confira se o backend está saudável: `docker compose logs backend`
  - Teste endpoint direto: `curl -X POST http://localhost:5001/classificar-texto -H 'Content-Type: application/json' -d '{"text": "teste"}'`

## Licença

Uso interno/educacional. Adapte uma licença formal (por exemplo, MIT) conforme a necessidade do seu projeto.
