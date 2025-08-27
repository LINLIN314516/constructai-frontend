import React from "react";
import { useParams, useNavigate } from "react-router-dom";

//新增：
// 对应 HiFi 里的 Top 8 Roles，id 与你的卡片跳转保持一致
const ROLES = [
    { id: "site-eng", label: "Site Engineer" },
    { id: "bim-coord", label: "BIM Coordinator" },
    { id: "pm", label: "Project Manager" },
    { id: "scheduler", label: "Scheduler" },
    { id: "cost-estimator", label: "Cost Estimator" },
    { id: "foreman", label: "Foreman" },
    { id: "hse-advisor", label: "HSE Advisor" },
    { id: "planner", label: "Planner" },
  ];
//新增结束  

const COLORS = {
  border: "var(--ca-border, #E5E7EB)",
  primary: "var(--ca-primary, #5B5CE2)",
};

const TABLE = [
  { skill: "Computer Vision", posts: 273, growth: "+12% YoY", relevance: "High" },
  { skill: "Predictive Maintenance", posts: 189, growth: "+9% YoY", relevance: "Moderate" },
  { skill: "Robotics Integration", posts: 145, growth: "+5% YoY", relevance: "Moderate" },
  { skill: "NLP", posts: 120, growth: "+7% YoY", relevance: "Emerging" },
];

export default function ExplorerRole() {
  const { id } = useParams(); // e.g., 'site-eng'
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
  AI/ML skill for:
  <select
    value={id}
    onChange={(e) => nav(`/explorer/role/${e.target.value}`)}
    aria-label="Select role"
    style={{
      background: "#EEF2FF",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      padding: "6px 10px",
      fontWeight: 600,
    }}
  >
    {ROLES.map(r => (
      <option key={r.id} value={r.id}>{r.label}</option>
    ))}
  </select>
</h2>


      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {["Rank", "Skill", "Job Postings", "Growth Rate", "Relevance Level"].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row, i) => (
              <tr key={row.skill}>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{i + 1}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.skill}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.posts}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.growth}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.relevance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => nav(`/explorer/visualisation/role/${id}`)}
        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid transparent", background: COLORS.primary, color: "#fff" }}
      >
        Visualisation
      </button>
    </div>
  );
}
