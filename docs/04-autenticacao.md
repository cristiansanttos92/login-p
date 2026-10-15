# Etapa 4 — Fluxo de autenticação

## Cadastro

1. O formulário envia nome, e-mail e senha para `POST /api/auth/register`.
2. Zod valida e normaliza os dados; o e-mail é armazenado em minúsculas.
3. bcrypt gera o hash da senha.
4. O backend persiste somente o hash, gera um JWT válido por uma hora e devolve
   o token com um perfil sem campos secretos.

## Login

1. O formulário envia e-mail e senha para `POST /api/auth/login`.
2. O backend busca o e-mail normalizado e verifica o hash com bcrypt.
3. Se as credenciais estiverem corretas, um novo JWT é emitido.

## Rota protegida

Depois de autenticar, a interface envia `GET /api/auth/me` com
`Authorization: Bearer <token>`. O backend verifica assinatura e validade do JWT,
busca a conta e devolve somente `id`, `name` e `email`.

## O que observar

- A API jamais deve comparar ou armazenar senhas em texto puro.
- O segredo JWT vem de `.env`, não do código versionado.
- `.env` e o arquivo JSON de usuários estão no `.gitignore`.
- Um JWT assinado não é criptografado: não coloque dados secretos no payload.
- O token da demonstração não persiste após recarregar a página.

Essas medidas ajudam a ensinar fundamentos; não tornam este exemplo pronto para
produção.
