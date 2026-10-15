import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import {
  createUser,
  findUserByEmail,
  findUserById,
  toPublicUser,
} from "./userStore.js";

const app = express();
const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "A senha pode ter no máximo 72 bytes.",
  );
const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com pelo menos 2 caracteres.").max(80),
  email: z.email().trim().max(254),
  password: passwordSchema,
});
const loginSchema = z.object({
  email: z.email().trim().max(254),
  password: z
    .string()
    .min(1)
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "A senha pode ter no máximo 72 bytes.",
    ),
});

app.use(cors({ origin: "http://127.0.0.1:5173" }));
app.use(express.json({ limit: "10kb" }));

function normalizedEmail(email) {
  return email.trim().toLowerCase();
}

function issueToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET precisa estar configurado com pelo menos 32 bytes.");
  }
  return jwt.sign({ sub: user.id }, secret, { expiresIn: "1h" });
}

function sendValidationError(response, error) {
  return response.status(400).json({ error: error.issues[0]?.message ?? "Dados inválidos." });
}

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/auth/register", async (request, response, next) => {
  const result = registerSchema.safeParse(request.body);
  if (!result.success) return sendValidationError(response, result.error);

  try {
    const { name, password } = result.data;
    const email = normalizedEmail(result.data.email);
    if (findUserByEmail(email)) {
      return response.status(409).json({ error: "Este e-mail já está cadastrado." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = createUser({ name, email, passwordHash });
    if (!user) {
      return response.status(409).json({ error: "Este e-mail já está cadastrado." });
    }

    return response.status(201).json({
      token: issueToken(user),
      user: toPublicUser(user),
    });
  } catch (error) {
    return next(error);
  }
});

app.post("/api/auth/login", async (request, response, next) => {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) return sendValidationError(response, result.error);

  try {
    const user = findUserByEmail(normalizedEmail(result.data.email));
    const passwordMatches =
      user && (await bcrypt.compare(result.data.password, user.passwordHash));
    if (!user || !passwordMatches) {
      return response.status(401).json({ error: "E-mail ou senha incorretos." });
    }

    return response.json({ token: issueToken(user), user: toPublicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.get("/api/auth/me", (request, response) => {
  const authorization = request.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");
  const secret = process.env.JWT_SECRET;
  if (scheme !== "Bearer" || !token || !secret) {
    return response.status(401).json({ error: "Autenticação necessária." });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return response.status(401).json({ error: "Token inválido ou expirado." });
    }

    const user = findUserById(payload.sub);
    if (!user) {
      return response.status(401).json({ error: "Token inválido ou expirado." });
    }

    return response.json({ user: toPublicUser(user) });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({ error: "Token inválido ou expirado." });
    }
    throw error;
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Erro interno do servidor." });
});

export default app;
