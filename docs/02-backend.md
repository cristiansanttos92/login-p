# Etapa 2 — API e armazenamento

## Inicialização

`server/src/index.js` carrega as variáveis locais de `.env`, valida `JWT_SECRET`
e inicia o Express na interface de loopback, porta 3000 por padrão. Uma chave
ausente ou menor que 32 bytes encerra a inicialização com um erro explícito.

## Rotas

| Método | Rota | Comportamento |
|---|---|---|
| `GET` | `/api/health` | Confirma que a API está respondendo. |
| `POST` | `/api/auth/register` | Valida e-mail, nome e senha; cria a conta e devolve token e perfil. |
| `POST` | `/api/auth/login` | Confere a senha e devolve token e perfil. |
| `GET` | `/api/auth/me` | Devolve o perfil quando recebe um token válido em `Authorization: Bearer`. |

Os dados inválidos recebem `400`; e-mail já cadastrado recebe `409`; credenciais
incorretas ou token inválido recebem `401`. Login usa uma mensagem genérica para
não distinguir e-mail inexistente de senha incorreta.

## Senhas e dados

As senhas são transformadas com bcrypt (12 rounds) antes de persistir. A API
nunca devolve o hash no perfil público. A comparação no login usa
`bcrypt.compare`, não uma comparação direta de strings.

Para simplificar o exercício, as contas são salvas em
`server/data/users.json`. O arquivo é criado automaticamente e ignorado pelo Git.
O backend também aceita `USERS_FILE_PATH` para isolar o arquivo nos testes.

## Exercício sugerido

Abra `server/src/app.js`: localize os esquemas Zod, as rotas e o tratamento dos
tokens. Altere uma validação e execute `npm test` para observar o efeito.
