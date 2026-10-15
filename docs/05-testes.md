# Etapa 5 — Testes e experimentos

## Executar os testes

Na raiz:

```powershell
npm test
```

Os testes usam o executor nativo `node:test` e um arquivo temporário isolado. Eles
cobrem criação de conta, normalização do e-mail, dados inválidos, duplicidade,
login, proteção da rota de perfil e ausência de campos de senha na resposta.

## Verificar o build

```powershell
npm run build
```

Esse comando valida os tipos TypeScript e gera a versão compilada do frontend.

## Experimentar a API manualmente

Com `npm run dev` em execução, experimente no PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

O cadastro e o login aceitam JSON em `/api/auth/register` e `/api/auth/login`.
Para testar a rota `/api/auth/me`, envie o token recebido no cabeçalho
`Authorization: Bearer <token>`.

## Próximos desafios

- Criar testes para senha curta, senha acima de 72 bytes e token expirado.
- Substituir o JSON por um banco relacional e adicionar migrações.
- Adicionar confirmação de senha, mensagens de acessibilidade e estados de foco.
- Estudar como cookies `HttpOnly`, CSRF e limitação de tentativas se encaixam em
  uma aplicação real, sem reutilizar este projeto como base de produção.
