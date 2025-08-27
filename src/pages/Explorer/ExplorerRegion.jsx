import React from "react";
import { useParams, useNavigate } from "react-router-dom";

//新增2: 增加静态地区列表：
const REGIONS = [
    { id: "vic-au", label: "Victoria, AU" },
    { id: "nsw-au", label: "New South Wales, AU" },
    { id: "qld-au", label: "Queensland, AU" },
    { id: "tas-au", label: "Tasmania, AU" },
    { id: "on-ca",  label: "Ontario, CA" },
    { id: "tx-us",  label: "Texas, US" },
  ];
//新增结束  

const COLORS = {
  border: "var(--ca-border, #E5E7EB)",
  primary: "var(--ca-primary, #5B5CE2)",
};

const TABLE = [
  { skill: "Natural Language Processing", posts: 482, growth: "+12% YoY", roles: "Site Engineer, QA Eng." },
  { skill: "Computer Vision", posts: 465, growth: "+9% YoY", roles: "BIM Coord., Planner" },
  { skill: "MLOps", posts: 390, growth: "+8% YoY", roles: "AI Eng., PM" },
  { skill: "Risk Modeling", posts: 189, growth: "+3% YoY", roles: "Scheduler, HSE" },
];

export default function ExplorerRegion() {
  const { id } = useParams(); // e.g., 'vic-au'
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>

         <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            AI/ML skill demand across job postings in:
            <select
            value={id}
            onChange={(e) => nav(`/explorer/region/${e.target.value}`)}
            style={{
                background: "#EEF2FF",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: "6px 10px",
                fontWeight: 600
            }}
            aria-label="Select region"
            >
                {REGIONS.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                    </select>
                    </h2>

      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {["Rank", "Skill", "Job Postings", "Growth Rate", "Roles Using This Skill"].map((h, i) => (
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
                <td style={{ padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}` }}>{row.roles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4 张信息卡（静态占位，符合 HiFi） */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginTop: 12 }}>
        <InfoCard title="Total AI/ML Jobs" value="1823 job posts" />
        <InfoCard title="Avg AI Relevance" value="64% of tech jobs" />
        <InfoCard title="Most Common Role" value="BIM Coordinator" />
        <InfoCard title="Leading Industry" value="Infrastructure" />
        </div>
        
        {/* Source 标注 */}
        <div style={{ marginTop: 12, fontSize: 12, color: "#6B7280", textAlign: "right" }}>
            Source: <em>Construction AI Skill Analyzer (2025)</em>
            </div>


      <button
        type="button"
        onClick={() => nav(`/explorer/visualisation/region/${id}`)}
        style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid transparent", background: COLORS.primary, color: "#fff" }}
      >
        Visualisation
      </button>
    </div>
  );
}


// 小型信息卡组件（灰色卡片）
function InfoCard({ title, value }) {
    return (
      <div style={{
        background: "#F3F4F6",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: "14px 16px"
      }}>
        <div style={{ fontSize: 12, color: "#6B7280" }}>{title}</div>
        <div style={{ fontWeight: 700 }}>{value}</div>
      </div>
    );
  }
  
