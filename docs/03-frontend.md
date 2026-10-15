# Etapa 3 — Interface React

## Organização

- `client/src/App.tsx` mantém o modo do formulário, os campos, o estado de
  carregamento, erros e a sessão atual.
- `client/src/styles.css` implementa o layout responsivo e os estados visuais.
- `client/vite.config.ts` encaminha chamadas `/api` para o Express local durante
  o desenvolvimento.

## Formulários

O controle de modo alterna entre entrar e criar conta. Os campos têm validação
básica do navegador para ajudar a pessoa usuária, mas o servidor repete e valida
as regras independentemente: validação no frontend não é uma barreira de
segurança.

Enquanto a solicitação está em andamento, o botão fica desabilitado. Erros da API
são apresentados junto ao formulário; no sucesso, a tela mostra o perfil
retornado pelo servidor.

## Sessão

O token permanece apenas no estado React. Isso é deliberadamente simples para
que o fluxo seja fácil de observar e evita persistir o token no armazenamento
local do navegador. Atualizar a página encerra a sessão da demonstração.

## Exercício sugerido

Adicione um campo visual de confirmação de senha no cadastro. A validação de
confirmação pode acontecer na interface; a senha recebida pela API ainda deve
ser validada no servidor.
