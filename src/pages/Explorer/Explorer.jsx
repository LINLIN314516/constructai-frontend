// Explorer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://73fgxcxzz9.execute-api.ap-southeast-2.amazonaws.com";

const COLORS = {
  card: "var(--ca-card, #F7F7FC)",
  border: "var(--ca-border, #E5E7EB)",
  text: "var(--ca-text, #1F2340)",
  sub: "var(--ca-subtext, #6B7280)",
  primary: "var(--ca-primary, #5B5CE2)",
};

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

// ---------- utils ----------
const slugify = (s = "") =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

// 1m / 3m / 6m / 12m → {date_from, date_to}
function rangeToDates(preset) {
  const monthsMap = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };
  const months = monthsMap[preset] ?? 1;
  const to = new Date();
  to.setHours(0, 0, 0, 0);
  const from = new Date(to);
  from.setMonth(from.getMonth() - months);
  return { date_from: fmt(from), date_to: fmt(to) };
}

async function fetchTopDemand({ mode, limit, date_from, date_to }) {
  const url = new URL(`${API_BASE}/top-demand`);
  url.searchParams.set("mode", mode);
  url.searchParams.set("limit", String(limit ?? 10));
  if (date_from) url.searchParams.set("date_from", date_from);
  if (date_to) url.searchParams.set("date_to", date_to);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.result) ? json.result : [];
}

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
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12, color: COLORS.sub }}>{meta}</div>
    </button>
  );
}

function RangeSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Select time range"
      style={{
        padding: "6px 10px",
        borderRadius: 8,
        border: `1px solid ${COLORS.border}`,
        background: "#fff",
        fontSize: 12,
      }}
    >
      <option value="1m">recent 1 month</option>
      <option value="3m">recent 3 month</option>
      <option value="6m">recent 6 month</option>
      <option value="12m">recent 1 year</option>
    </select>
  );
}

export default function Explorer() {
  const nav = useNavigate();

  // Skills（榜单 + 时间范围）
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsErr, setSkillsErr] = useState(null);
  const [skillsRange, setSkillsRange] = useState("1m"); // 默认近 1 个月

  // Job titles（榜单 + 时间范围）
  const [jobTitles, setJobTitles] = useState([]);
  const [jtLoading, setJtLoading] = useState(true);
  const [jtErr, setJtErr] = useState(null);
  const [jtRange, setJtRange] = useState("1m"); // 默认近 1 个月

  // Regions 时间选择器（暂时仅 UI，占位）
  const [regionsRange, setRegionsRange] = useState("1m");

  // 拉取 Top 10 skills（随范围变化）
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setSkillsLoading(true);
        setSkillsErr(null);
        const { date_from, date_to } = rangeToDates(skillsRange);
        const data = await fetchTopDemand({ mode: "skill", limit: 10, date_from, date_to });
        if (aborted) return;
        const list = data
          .sort((a, b) => (b.totalCount ?? 0) - (a.totalCount ?? 0))
          .map((x) => ({ id: slugify(x.name), name: x.name, posts: x.totalCount }));
        setSkills(list);
      } catch (e) {
        if (!aborted) {
          setSkillsErr(e.message || "Failed to load skills");
          setSkills([]);
        }
      } finally {
        if (!aborted) setSkillsLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [skillsRange]);

  // 拉取 Top 10 job titles（随范围变化）
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setJtLoading(true);
        setJtErr(null);
        const { date_from, date_to } = rangeToDates(jtRange);
        const data = await fetchTopDemand({ mode: "jobTitle", limit: 10, date_from, date_to });
        if (aborted) return;
        const list = data
          .sort((a, b) => (b.totalCount ?? 0) - (a.totalCount ?? 0))
          .map((x) => ({ name: x.name, posts: x.totalCount }));
        setJobTitles(list);
      } catch (e) {
        if (!aborted) {
          setJtErr(e.message || "Failed to load job titles");
          setJobTitles([]);
        }
      } finally {
        if (!aborted) setJtLoading(false);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [jtRange]);

  return (
    <div style={{ padding: 24, color: COLORS.text }}>
      <h1 style={{ marginTop: 0 }}>Construction Explorer</h1>

      {/* 1) 顶部：Top 10 skills（后端 + 时间选择器） */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h3 style={{ marginBottom: 8 }}>Top 10 Most Queried AI/ML Skills</h3>
          {skillsLoading && <span style={{ fontSize: 12, color: COLORS.sub }}>(loading…)</span>}
          {skillsErr && <span style={{ fontSize: 12, color: "#b4232c" }}>(failed)</span>}
        </div>
        <RangeSelect value={skillsRange} onChange={setSkillsRange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {skills.map((s) => (
          <Card
            key={s.id}
            title={s.name}
            meta={`${Number(s.posts ?? 0).toLocaleString()} job posts`}
            onClick={() => nav(`/explorer/skill/${s.id}`)}
          />
        ))}
        {!skillsLoading && skills.length === 0 && (
          <div style={{ gridColumn: "1 / -1", color: COLORS.sub, fontSize: 13 }}>
            No data in this range.
          </div>
        )}
      </div>

      {/* 2) 中间：Regions（静态 + 时间选择器占位） */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ marginBottom: 8 }}>Top 8 Most Viewed Regions</h3>
        <RangeSelect value={regionsRange} onChange={setRegionsRange} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {REGIONS.map((r) => (
          <Card
            key={r.id}
            title={r.name}
            meta={`Top skill: ${r.top} · ${r.demand}`}
            onClick={() => nav(`/explorer/region/${r.id}`)}
          />
        ))}
      </div>

      {/* 3) 底部：Top 10 job titles（后端 + 时间选择器） */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h3 style={{ marginBottom: 8 }}>Top 10 Most In-Demand Job Titles</h3>
          {jtLoading && <span style={{ fontSize: 12, color: COLORS.sub }}>(loading…)</span>}
          {jtErr && <span style={{ fontSize: 12, color: "#b4232c" }}>(failed)</span>}
        </div>
        <RangeSelect value={jtRange} onChange={setJtRange} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {jobTitles.map((j, idx) => (
          <Card
            key={`${j.name}-${idx}`}
            title={j.name}
            meta={j.posts != null ? `${Number(j.posts).toLocaleString()} job posts` : "— job posts"}
            onClick={undefined}
          />
        ))}
        {!jtLoading && jobTitles.length === 0 && (
          <div style={{ gridColumn: "1 / -1", color: COLORS.sub, fontSize: 13 }}>
            No data in this range.
          </div>
        )}
      </div>
    </div>
  );
}




