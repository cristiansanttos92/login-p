import { useState, type FormEvent } from "react";

type Mode = "login" | "register";
type User = { id: string; name: string; email: string };
type AuthResponse = { token: string; user: User };

const initialForm = { name: "", email: "", password: "" };

async function request<T>(path: string, body?: unknown, token?: string): Promise<T> {
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(result.error ?? "Não foi possível concluir a solicitação.");
  }

  return result;
}

export default function App() {
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState(initialForm);
  const [session, setSession] = useState<(AuthResponse & { message?: string }) | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const path =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const result = await request<AuthResponse & { message?: string }>(
        path,
        form,
      );
      setSession(result);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Ocorreu um erro inesperado.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    if (!session) return;

    try {
      await request<{ user: User }>("/api/auth/me", undefined, session.token);
      setSession(null);
      setMode("login");
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Não foi possível encerrar a sessão.",
      );
      setSession(null);
    }
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setForm(initialForm);
    setError("");
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Login P, página inicial">
          <span className="brand-mark">p.</span>
          <span>login<span className="brand-light">p</span></span>
        </a>
        <span className="topbar-note">UM PROJETO PARA APRENDER</span>
      </header>

      <section className="login-layout" aria-label="Acesso à sua conta">
        <div className="intro">
          <div className="eyebrow"><span /> AUTENTICAÇÃO, SEM MISTÉRIO</div>
          <h1>
            Seu próximo
            <br />
            passo começa
            <br />
            <span>aqui.</span>
          </h1>
          <p className="intro-copy">
            Um espaço simples para entrar ou criar sua conta. Por trás da tela,
            um fluxo completo de autenticação para você explorar.
          </p>
          <div className="feature-list">
            <div className="feature">
              <span className="feature-icon" aria-hidden="true">01</span>
              <span>Cadastro com validação de dados</span>
            </div>
            <div className="feature">
              <span className="feature-icon" aria-hidden="true">02</span>
              <span>Senhas protegidas com hash</span>
            </div>
            <div className="feature">
              <span className="feature-icon" aria-hidden="true">03</span>
              <span>Sessão autenticada com token</span>
            </div>
          </div>
          <div className="intro-footer">
            <span className="status-dot" /> API local conectada via Vite
          </div>
        </div>

        <div className="form-card">
          {session ? (
            <div className="success-panel">
              <div className="success-icon" aria-hidden="true">✓</div>
              <p className="card-kicker">ACESSO CONFIRMADO</p>
              <h2>Que bom ter você, {session.user.name}.</h2>
              <p className="card-description">
                Sua conta está autenticada. Este conteúdo veio da API protegida.
              </p>
              <div className="account-summary">
                <span className="avatar">
                  {session.user.name.charAt(0).toUpperCase()}
                </span>
                <span>
                  <strong>{session.user.name}</strong>
                  <small>{session.user.email}</small>
                </span>
                <span className="verified" aria-label="Conta autenticada">✓</span>
              </div>
              <button className="submit-button" onClick={handleLogout} type="button">
                Sair da conta <span aria-hidden="true">↗</span>
              </button>
            </div>
          ) : (
            <>
              <p className="card-kicker">
                {mode === "login" ? "BEM-VINDO DE VOLTA" : "É BOM TER VOCÊ AQUI"}
              </p>
              <h2>{mode === "login" ? "Entre na sua conta" : "Crie sua conta"}</h2>
              <p className="card-description">
                {mode === "login"
                  ? "Informe seus dados para continuar."
                  : "Leva só um instante. Preencha seus dados abaixo."}
              </p>

              <div className="mode-switch" role="tablist" aria-label="Tipo de acesso">
                <button
                  aria-selected={mode === "login"}
                  className={mode === "login" ? "active" : ""}
                  onClick={() => changeMode("login")}
                  role="tab"
                  type="button"
                >
                  Entrar
                </button>
                <button
                  aria-selected={mode === "register"}
                  className={mode === "register" ? "active" : ""}
                  onClick={() => changeMode("register")}
                  role="tab"
                  type="button"
                >
                  Criar conta
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {mode === "register" && (
                  <label className="field">
                    <span>Nome</span>
                    <input
                      autoComplete="name"
                      maxLength={80}
                      minLength={2}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      placeholder="Como podemos chamar você?"
                      required
                      value={form.name}
                    />
                  </label>
                )}
                <label className="field">
                  <span>E-mail</span>
                  <input
                    autoComplete="email"
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    placeholder="voce@exemplo.com"
                    required
                    type="email"
                    value={form.email}
                  />
                </label>
                <label className="field">
                  <span>Senha</span>
                  <input
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    minLength={8}
                    onChange={(event) =>
                      setForm({ ...form, password: event.target.value })
                    }
                    placeholder="Mínimo de 8 caracteres"
                    required
                    type="password"
                    value={form.password}
                  />
                  {mode === "register" && (
                    <small className="field-hint">
                      Use pelo menos 8 caracteres (até 72 bytes).
                    </small>
                  )}
                </label>
                {error && (
                  <p className="error-message" role="alert">{error}</p>
                )}
                <button className="submit-button" disabled={loading} type="submit">
                  {loading
                    ? "Aguarde..."
                    : mode === "login"
                      ? "Entrar na conta"
                      : "Criar minha conta"}
                  {!loading && <span aria-hidden="true">↗</span>}
                </button>
              </form>

              <p className="form-note">
                Projeto didático. Não use dados ou senhas reais.
              </p>
            </>
          )}
        </div>
      </section>

      <footer className="page-footer">
        <span>FEITO PARA APRENDER, UM PASSO DE CADA VEZ.</span>
        <a href="https://github.com/cristiansanttos92/login-p" target="_blank" rel="noreferrer">
          CÓDIGO ABERTO <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </main>
  );
}
