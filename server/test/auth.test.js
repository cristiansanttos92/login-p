import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";

const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), "login-p-test-"));
process.env.USERS_FILE_PATH = path.join(temporaryDirectory, "users.json");
process.env.JWT_SECRET = "chave-de-teste-local-com-mais-de-32-bytes";

const { default: app } = await import("../src/app.js");
let server;
let baseUrl;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

async function post(pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { response, body: await response.json() };
}

test("registra uma conta e não expõe a senha", async () => {
  const { response, body } = await post("/api/auth/register", {
    name: "Pessoa Exemplo",
    email: "Pessoa@Exemplo.com",
    password: "senha-de-teste",
  });

  assert.equal(response.status, 201);
  assert.equal(body.user.email, "pessoa@exemplo.com");
  assert.ok(body.token);
  assert.equal("passwordHash" in body.user, false);
  assert.equal("password" in body.user, false);
});

test("rejeita e-mail duplicado e credenciais incorretas", async () => {
  const duplicate = await post("/api/auth/register", {
    name: "Outra Pessoa",
    email: "pessoa@exemplo.com",
    password: "outra-senha",
  });
  const invalidLogin = await post("/api/auth/login", {
    email: "pessoa@exemplo.com",
    password: "senha-errada",
  });

  assert.equal(duplicate.response.status, 409);
  assert.equal(invalidLogin.response.status, 401);
});

test("valida dados e protege o endpoint da sessão", async () => {
  const invalidRegister = await post("/api/auth/register", {
    name: "A",
    email: "invalido",
    password: "curta",
  });
  const oversizedPassword = await post("/api/auth/login", {
    email: "pessoa@exemplo.com",
    password: "á".repeat(37),
  });
  const unauthorized = await fetch(`${baseUrl}/api/auth/me`);
  const login = await post("/api/auth/login", {
    email: "PESSOA@EXEMPLO.COM",
    password: "senha-de-teste",
  });
  const authenticated = await fetch(`${baseUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${login.body.token}` },
  });
  const session = await authenticated.json();

  assert.equal(invalidRegister.response.status, 400);
  assert.equal(oversizedPassword.response.status, 400);
  assert.equal(unauthorized.status, 401);
  assert.equal(login.response.status, 200);
  assert.equal(authenticated.status, 200);
  assert.equal(session.user.name, "Pessoa Exemplo");
});
