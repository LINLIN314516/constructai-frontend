import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// 可按需增删，id 要和你的路由一致
const SKILLS = [
    { id: "nlp",   label: "NLP" },
    { id: "cv",    label: "Computer Vision" },
    { id: "pa",    label: "Predictive Analytics" },
    { id: "mlops", label: "MLOps" },
  ];
//新增结束  

const COLORS = {
  border: "var(--ca-border, #E5E7EB)",
  sub: "var(--ca-subtext, #6B7280)",
  primary: "var(--ca-primary, #5B5CE2)",
};

const TABLE = [
  { region: "Victoria, Australia", posts: 482, growth: "+12% YoY", salary: "$95K" },
  { region: "Ontario, Canada", posts: 405, growth: "+15% YoY", salary: "$92K" },
  { region: "Maharashtra, India", posts: 385, growth: "+10% YoY", salary: "$61K" },
  { region: "New South Wales, Australia", posts: 359, growth: "+7% YoY", salary: "$88K" },
];

export default function ExplorerSkill() {
  const { id } = useParams(); // e.g., 'nlp'
  const nav = useNavigate();
  const skillName = id === "nlp" ? "NLP" : id === "cv" ? "Computer Vision" : id?.toUpperCase();

  return (
    <div style={{ padding: 24 }}>
      
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
  AI Skills Ranking:
  <select
    value={id}
    onChange={(e) => nav(`/explorer/skill/${e.target.value}`)}
    aria-label="Select skill"
    style={{
      background: "#EEF2FF",
      border: "1px solid #E5E7EB",
      borderRadius: 8,
      padding: "6px 10px",
      fontWeight: 600,
    }}
  >
    {SKILLS.map(s => (
      <option key={s.id} value={s.id}>{s.label}</option>
    ))}
  </select>
</h2>


      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{ background: "#fff" }}>
              {["Rank", "Region", "Job Postings", "Growth Rate", "Avg Salary"].map((h, i) => (
                <th key={i} style={{ textAlign: "left", padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE.map((row, i) => (
              <tr key={row.region}>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{i + 1}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.region}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.posts}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.growth}</td>
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       {/* 4 张信息卡（静态占位，符合 HiFi） */}
       <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12 }}>
        <InfoCard title="High Demand"       value="482 job posts in Victoria" />
        <InfoCard title="Strong Growth"     value="+12% increase since 2023" />
        <InfoCard title="Role Coverage"     value="Relevant to 8+ job roles" />
        <InfoCard title="Avg Salary"        value="$90K" />
      </div>

      {/* Source 标注 */}
      <div style={{ marginTop: 12, fontSize: 12, color: "#6B7280", textAlign: "right" }}>
        Source: <em>Construction AI Skill Analyzer (2025)</em>
       </div>

      <button
        type="button"
        onClick={() => nav(`/explorer/visualisation/skill/${id}`)}
        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid transparent", background: COLORS.primary, color: "#fff" }}
      >
        Visualisation
      </button>
    </div>

  );

}



function InfoCard({ title, value }) {
    return (
      <div
        style={{
          background: "#F3F4F6",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "14px 16px",
          minHeight: 88,
        }}
      >
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6 }}>{title}</div>
        <div style={{ fontWeight: 700 }}>{value}</div>
      </div>
    );
  }
  