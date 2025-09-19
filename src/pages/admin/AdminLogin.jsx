// original code:
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LOGIN_API = "https://uyjt6p4lql.execute-api.ap-southeast-2.amazonaws.com/login";

export default function AdminLogin() {
  // 为了便于测试，默认填入文档里的账号密码；
  const [account, setAccount] = useState("Admin");
  const [password, setPassword] = useState("Admin123");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function callLogin({ username, password }) {
    const res = await fetch(LOGIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // 尝试解析成 JSON
    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      // ignore
    }

    if (!res.ok) {
      // 非 2xx，当成错误
      throw new Error(data?.error || `HTTP ${res.status}`);
    }
    return data; // 预期 { success: true/false, error? }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const u = account.trim();
    const p = password;

    if (!u || !p) {
      setError("Please enter username and password");
      return;
    }

    setPending(true);
    try {
      const resp = await callLogin({ username: u, password: p });

      if (resp?.success) {
        // 这个 API 是无状态校验：前端自己记录“已登录”标记
        localStorage.setItem("admin_token", "login_ok");
        localStorage.setItem("admin_name", u);
        localStorage.setItem("admin_login_time", String(Date.now()));

        // 进入 Admin 首页
        navigate("/admin", { replace: true });
      } else {
        throw new Error(resp?.error || "Invalid username or password");
      }
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-login">
      {/* 顶部标题（与其它 Admin 页面一致） */}
      <div className="admin-hero">
        <h1 className="admin-hero-title">Construct AI Skills Analyser</h1>
        <div className="admin-hero-subtitle">Administrator Console</div>
      </div>

      {/* 居中表单 */}
      <form className="admin-login-form" onSubmit={onSubmit}>
        <label className="field-label" htmlFor="loginAccount">Account</label>
        <input
          id="loginAccount"
          className="input"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          autoComplete="username"
          disabled={pending}
        />

        <label className="field-label" htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          disabled={pending}
        />

        {error && <div className="form-msg error" role="alert">{error}</div>}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary btn-block"
        >
          {pending ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}


