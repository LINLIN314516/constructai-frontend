import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TrendsExport() {
  const { state } = useLocation(); // { from:"trends", years, enabled }
  const nav = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h1>Export (Demand Trends)</h1>
      <p style={{ color: "#6B7280" }}>
        From: <b>{state?.from || "unknown"}</b> · Years: {state?.years?.join(", ") || "-"} · Skills: {state?.enabled?.join(", ") || "-"}
      </p>
      <button onClick={() => alert("Export successfully!")}>Export</button>
      <button style={{ marginLeft: 8 }} onClick={() => nav(-1)}>Back</button>
    </div>
  );
}
