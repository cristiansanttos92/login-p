import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const usersFile =
  process.env.USERS_FILE_PATH ?? path.resolve(directory, "../data/users.json");

function readUsers() {
  try {
    const content = readFileSync(usersFile, "utf8");
    const users = JSON.parse(content);
    if (!Array.isArray(users)) {
      throw new Error("O arquivo local de usuários precisa conter uma lista.");
    }
    return users;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function writeUsers(users) {
  mkdirSync(path.dirname(usersFile), { recursive: true });
  writeFileSync(usersFile, `${JSON.stringify(users, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

export function findUserByEmail(email) {
  return readUsers().find((user) => user.email === email);
}

export function findUserById(id) {
  return readUsers().find((user) => user.id === id);
}

export function createUser({ name, email, passwordHash }) {
  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return null;
  }

  const user = {
    id: randomUUID(),
    name,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function toPublicUser({ id, name, email }) {
  return { id, name, email };
}
