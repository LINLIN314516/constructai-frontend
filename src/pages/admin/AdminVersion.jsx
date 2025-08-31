import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminVersion() {
  const [versions, setVersions] = useState(["version1", "version2", "version3", "version4"]);
  const [selected, setSelected] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO：若接后端，从接口取版本列表并 setVersions，再 setSelected("")
    // fetch("/api/admin/version/list", { headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}`}})
    //   .then(r => r.json())
    //   .then(d => setVersions(d.versions || []));
  }, []);

  async function onManage() {
    if (!selected) {
      setMessage("Please choose a version first.");
      return;
    }
    setPending(true);
    setMessage("");
    try {
      // TODO：get in the backend
      // await fetch("/api/admin/version/rollback", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      //   body: JSON.stringify({ to: selected }),
      // });

      await new Promise(r => setTimeout(r, 600)); // demo
      setMessage("The selected version is successfully restored.");
    } catch (e) {
      setMessage(e?.message || "Rollback failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="admin-version">
      {/* title */}
      <div className="admin-hero">
        <h1 className="admin-hero-title">Construct AI Skills Analyser</h1>
        <div className="admin-hero-subtitle">Administrator Console — Version Control</div>
      </div>

      {/* html */}
      <div className="admin-version-form">
        <label htmlFor="versionSelect" className="field-label">Label</label>

        <select
          id="versionSelect"
          className="select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="" disabled>Choose the version</option>
          {versions.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <button
          className="btn-primary admin-version-manage"
          onClick={onManage}
          disabled={pending || !selected}
        >
          {pending ? "Managing…" : "Manage"}
        </button>

        {message && <div className="form-msg">{message}</div>}
      </div>

      {/* BACK BUTTON */}
      <button
        type="button"
        className="admin-fab-back"
        onClick={() => navigate("/admin")}
      >
        ⬅️ Back to menu
      </button>
    </div>
  );
}
