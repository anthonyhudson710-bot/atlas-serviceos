import { Controller, Get, Header } from "@nestjs/common";

@Controller()
export class AppController {
  // Liveness probe used by the Docker HEALTHCHECK and Caddy.
  @Get("health")
  health() {
    return { status: "ok", service: "api" };
  }

  // Sentry verification: always throws so server-side capture (SentryGlobalFilter)
  // can be confirmed in dev and prod. Safe to delete once monitoring is verified.
  @Get("debug-sentry")
  debugSentry() {
    throw new Error("Sentry test — api server error (debug-sentry endpoint)");
  }

  // Minimal shared login page served at iam.atlasfsm.com/login. Posts to the
  // same-origin /auth endpoints; on success the session cookie is set for
  // .atlasfsm.com so app. and harmony. are both authenticated.
  @Get("login")
  @Header("content-type", "text/html; charset=utf-8")
  loginPage() {
    return LOGIN_HTML;
  }
}

const LOGIN_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Sign in · Atlas</title>
<style>
  :root { color-scheme: light; }
  body { margin:0; min-height:100vh; display:grid; place-items:center;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background:#0b2370; color:#0b2370; }
  .card { background:#fff; width:min(92vw,360px); padding:2rem; border-radius:16px;
    box-shadow:0 10px 40px rgba(0,0,0,.25); }
  h1 { margin:0 0 1.25rem; font-size:1.25rem; }
  label { display:block; font-size:.8rem; font-weight:600; margin:.75rem 0 .25rem; }
  input { width:100%; box-sizing:border-box; height:2.5rem; padding:0 .75rem;
    border:1px solid #c7ccd9; border-radius:9999px; font-size:1rem; }
  button { margin-top:1.25rem; width:100%; height:2.75rem; border:none; cursor:pointer;
    border-radius:9999px; background:#0b2370; color:#fff; font-weight:700; font-size:1rem; }
  .row { margin-top:.75rem; font-size:.8rem; text-align:center; }
  a { color:#0b2370; }
  .msg { margin-top:.75rem; font-size:.85rem; min-height:1.1em; color:#b00020; }
</style>
</head>
<body>
  <form class="card" id="f">
    <h1>Sign in to Atlas</h1>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required />
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required minlength="8" />
    <button type="submit">Sign in</button>
    <p class="row"><a href="#" id="toggle">Create an account instead</a></p>
    <p class="msg" id="msg"></p>
  </form>
<script>
  const f = document.getElementById("f");
  const msg = document.getElementById("msg");
  const params = new URLSearchParams(location.search);
  let mode = params.get("mode") === "register" ? "register" : "login";
  const toggle = document.getElementById("toggle");
  const btn = f.querySelector("button");
  function render() {
    btn.textContent = mode === "register" ? "Create account" : "Sign in";
    toggle.textContent = mode === "register" ? "Have an account? Sign in" : "Create an account instead";
  }
  render();
  toggle.addEventListener("click", (e) => { e.preventDefault(); mode = mode === "register" ? "login" : "register"; render(); });
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";
    const body = JSON.stringify({ email: f.email.value, password: f.password.value });
    try {
      const res = await fetch("/auth/" + mode, {
        method: "POST", credentials: "include",
        headers: { "content-type": "application/json" }, body,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        msg.textContent = (data && data.message) || "Sign in failed.";
        return;
      }
      // Only redirect back to first-party hosts — never an attacker-supplied URL.
      const target = params.get("redirect");
      let dest = "/auth/me";
      if (target) {
        try {
          const u = new URL(target);
          if (u.hostname === "localhost" || u.hostname === "atlasfsm.com" || u.hostname.endsWith(".atlasfsm.com")) {
            dest = target;
          }
        } catch {}
      }
      location.href = dest;
    } catch {
      msg.textContent = "Network error.";
    }
  });
</script>
</body>
</html>`;
