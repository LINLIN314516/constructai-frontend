

import React from "react";
import { useNavigate } from "react-router-dom";

const COLORS = {
  card: "var(--ca-card, #F7F7FC)",
  border: "var(--ca-border, #E5E7EB)",
  text: "var(--ca-text, #1F2340)",
  sub: "var(--ca-subtext, #6B7280)",
  primary: "var(--ca-primary, #5B5CE2)",
};

const SKILLS = [
  { id: "nlp", name: "Natural Language Processing", growth: "+18% YoY", posts: "2050" },
  { id: "cv", name: "Computer Vision", growth: "+12% YoY", posts: "1900" },
  { id: "mlo", name: "Machine Learning Ops", growth: "+9% YoY", posts: "1500" },
  { id: "data", name: "Data Analytics", growth: "+7% YoY", posts: "1460" },
  { id: "pa", name: "Predictive Maintenance", growth: "+11% YoY", posts: "1200" },
  { id: "robot", name: "Robotics Integration", growth: "+6% YoY", posts: "980" },
  { id: "risk", name: "Risk Modeling", growth: "+5% YoY", posts: "760" },
  { id: "nlu", name: "Natural Language Understanding", growth: "+4% YoY", posts: "620" },
];

const REGIONS = [
  { id: "vic-au", name: "Victoria, Australia", top: "NLP", demand: "+25% YoY" },
  { id: "nsw-au", name: "New South Wales, Australia", top: "CV", demand: "+15% YoY" },
  { id: "qld-au", name: "Queensland, Australia", top: "MLOps", demand: "+9% YoY" },
  { id: "tas-au", name: "Tasmania, Australia", top: "Predictive", demand: "+6% YoY" },
  { id: "mh-in", name: "Maharashtra, India", top: "CV", demand: "+12% YoY" },
  { id: "on-ca", name: "Ontario, Canada", top: "NLP", demand: "+14% YoY" },
  { id: "tx-us", name: "Texas, USA", top: "MLOps", demand: "+7% YoY" },
  { id: "sp-br", name: "São Paulo, Brazil", top: "Maintenance", demand: "+5% YoY" },
];

const ROLES = [
  { id: "site-eng", name: "Site Engineer", rel: "41% relevance in postings" },
  { id: "bim", name: "BIM Coordinator", rel: "38% relevance" },
  { id: "pm", name: "Project Manager", rel: "33% relevance" },
  { id: "scheduler", name: "Scheduler", rel: "27% relevance" },
  { id: "estimator", name: "Cost Estimator", rel: "31% relevance" },
  { id: "foreman", name: "Foreman", rel: "28% relevance" },
  { id: "hse", name: "HSE Advisor", rel: "30% relevance" },
  { id: "planner", name: "Planner", rel: "29% relevance" },
];

function Card({ title, meta, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      style={{
        textAlign: "left",
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: "12px 14px",
        cursor: "pointer",
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, color: COLORS.sub }}>{meta}</div>
    </button>
  );
}

export default function Explorer() {
  const nav = useNavigate();

  return (
    <div style={{ padding: 24, color: COLORS.text }}>
      <h1 style={{ marginTop: 0 }}>Construction Explorer</h1>

      <h3>Top 8 Most Queried AI/ML Skills</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {SKILLS.map(s => (
          <Card
            key={s.id}
            title={s.name}
            meta={`${s.growth} · ${s.posts} job posts`}
            onClick={() => nav(`/explorer/skill/${s.id}`)}
          />
        ))}
      </div>

      <h3>Top 8 Most Viewed Regions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {REGIONS.map(r => (
          <Card
            key={r.id}
            title={r.name}
            meta={`Top skill: ${r.top} · ${r.demand}`}
            onClick={() => nav(`/explorer/region/${r.id}`)}
          />
        ))}
      </div>

      <h3>Top 8 Most AI-Relevant Construction Roles</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {ROLES.map(r => (
          <Card
            key={r.id}
            title={r.name}
            meta={r.rel}
            onClick={() => nav(`/explorer/role/${r.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
