# Etapa 1 — Visão geral

## O que vamos construir

Uma tela para criar conta e entrar, ligada a uma API local. Depois do login, a
interface consulta uma rota que exige um token válido e mostra o perfil retornado
pelo servidor.

## Tecnologias

- **React + TypeScript + Vite:** interface, estado dos formulários e servidor de
  desenvolvimento.
- **Express:** rotas HTTP do backend.
- **Zod:** validação dos dados recebidos pela API.
- **bcryptjs:** hash e verificação das senhas.
- **JWT:** token assinado para autenticar a rota de perfil.
- **Arquivo JSON local:** persistência simples para facilitar a inspeção durante
  o aprendizado.

## Pastas

- `client/`: aplicação React.
- `server/`: API, armazenamento local e testes.
- `docs/`: explicações organizadas por etapa.

## Preparar e executar

1. Instale Node.js 20.19+ ou 22.12+ e npm.
2. Na raiz, copie `.env.example` para `.env`.
3. Troque `JWT_SECRET` por uma chave aleatória local de pelo menos 32 bytes.
4. Execute `npm install` e depois `npm run dev`.
5. Abra http://127.0.0.1:5173.

O servidor e o frontend escutam apenas em `127.0.0.1`. O proxy de
`client/vite.config.ts` encaminha `/api` para a API local.

## Limites intencionais

O projeto não deve ser publicado ou usado como serviço real. Ele não oferece
proteções operacionais suficientes para produção: não há banco de dados
transacional, recuperação de conta, verificação de e-mail, limitação de tentativas
ou gerenciamento de sessão persistente no navegador. O token fica apenas no
estado da aplicação e desaparece ao recarregar a página.
