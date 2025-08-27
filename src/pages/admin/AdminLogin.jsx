import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [account, setAccount] = useState("Admin");
  const [password, setPassword] = useState("1234");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setPending(true);

    try {
      // —— 临时硬校验（验收用）——
      const OK_USER = "Admin";
      const OK_PASS = "1234";

      if (account.trim() !== OK_USER || password !== OK_PASS) {
        throw new Error("Invalid credentials");
      }

      // 写入本地登录态（与你的守卫保持一致）
      localStorage.setItem("admin_token", "demo_token");
      localStorage.setItem("admin_name", "admin");

      // 跳到 Admin 首页
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
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
        />

        <label className="field-label" htmlFor="loginPassword">Password</label>
        <input
          id="loginPassword"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="form-msg error">{error}</div>}

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



