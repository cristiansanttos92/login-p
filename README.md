# Login P — autenticação didática

Aplicação local para estudar cadastro, login e autenticação usando React, Express
e Node.js. A interface está em português e conversa com a API pelo proxy local
do Vite.

> **Somente para estudo local.** Este projeto não está preparado para produção.
> Não use dados pessoais nem senhas reais. O armazenamento em arquivo JSON,
> a configuração local e o fluxo de sessão são intencionalmente simples e não
> substituem uma solução de identidade revisada para produção.

## Etapas do projeto

1. [Visão geral e preparação do ambiente](docs/01-visao-geral.md)
2. [API e armazenamento local](docs/02-backend.md)
3. [Interface React](docs/03-frontend.md)
4. [Fluxo de autenticação](docs/04-autenticacao.md)
5. [Testes e experimentos](docs/05-testes.md)

## Requisitos

- Node.js 20.19+ ou 22.12+
- npm

## Executar localmente

Na raiz do projeto:

```powershell
Copy-Item .env.example .env
```

Edite `.env` e substitua `JWT_SECRET` por uma chave aleatória local com pelo
menos 32 bytes. Depois instale as dependências e inicie a interface e a API:

```powershell
npm install
npm run dev
```

- Interface: http://127.0.0.1:5173
- API: http://127.0.0.1:3000
- Verificação da API: http://127.0.0.1:3000/api/health

Os usuários ficam em `server/data/users.json`, arquivo local ignorado pelo Git.
Não apague `.env` durante a execução; ele contém a chave local usada para assinar
os tokens.

## Comandos úteis

```powershell
npm test
npm run build
```

Veja [os testes e experimentos](docs/05-testes.md) para exemplos da API e ideias
para continuar aprendendo.
