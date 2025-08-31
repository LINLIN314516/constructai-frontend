import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminImport() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  async function onImport() {
    if (!file) {
      setMessage("Please choose a file first.");
      return;
    }
    setPending(true);
    setMessage("");
    try {
      // TODO: get backend in here().
      // const fd = new FormData();
      // fd.append("file", file);
      // const res = await fetch("/api/admin/datasets/import", {
      //   method: "POST",
      //   body: fd,
      //   headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      // });
      // if (!res.ok) throw new Error("Import failed");
      // await res.json();

      await new Promise((r) => setTimeout(r, 600)); // demo
      setMessage("Dataset has been successfully updated.");
    } catch (err) {
      setMessage(err.message || "Import failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-import">
      {/* 居中标题（与 AdminMenu 保持一致） */}
      <div className="admin-hero">
        <h1 className="admin-hero-title">Construct AI Skills Analyser</h1>
        <div className="admin-hero-subtitle">Administrator Console — Data Importing</div>
      </div>

      {/* 中间内容卡片 */}
      <div className="admin-import-card">
        <label className="field-label">Choose your file</label>

        {/* 下一行放选择控件；不限制类型（去掉 accept） */}
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {file && <div className="file-name">Selected: {file.name}</div>}

        <button
          onClick={onImport}
          disabled={pending}
          className="btn-primary"
        >
          {pending ? "Importing…" : "Import"}
        </button>

        {message && <div className="import-msg">{message}</div>}
      </div>

      {/* 右下角返回按钮 */}
      <button
        type="button"
        className="admin-fab-back"
        onClick={() => navigate("/admin")}
        aria-label="Back to menu"
      >
        ⬅️ Back to menu
      </button>
    </div>
  );
}

