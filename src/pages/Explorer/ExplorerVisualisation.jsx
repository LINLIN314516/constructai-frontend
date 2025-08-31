import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ROLES = [
  { id: "site-eng",   label: "Site Engineer" },
  { id: "bim-coord",  label: "BIM Coordinator" },
  { id: "pm",         label: "Project Manager" },
  { id: "scheduler",  label: "Scheduler" },
];

const COUNTRIES = [
  { id: "au",  label: "Australia" },
  { id: "uk",  label: "UK" },
  { id: "usa", label: "USA" },
  { id: "de",  label: "Germany" },
];

// false data_test only（Sprint1）：role -> country -> { nlp, cv, ethics }
const DATA = {
  "site-eng": {
    au:  { nlp: 520, cv: 460, ethics: 410 },
    uk:  { nlp: 580, cv: 500, ethics: 430 },
    usa: { nlp: 540, cv: 520, ethics: 400 },
    de:  { nlp: 510, cv: 480, ethics: 380 },
  },
  "bim-coord": {
    au:  { nlp: 420, cv: 530, ethics: 360 },
    uk:  { nlp: 450, cv: 560, ethics: 380 },
    usa: { nlp: 470, cv: 590, ethics: 390 },
    de:  { nlp: 440, cv: 550, ethics: 370 },
  },
  pm: {
    au:  { nlp: 390, cv: 420, ethics: 330 },
    uk:  { nlp: 420, cv: 450, ethics: 350 },
    usa: { nlp: 460, cv: 470, ethics: 360 },
    de:  { nlp: 410, cv: 440, ethics: 340 },
  },
  scheduler: {
    au:  { nlp: 360, cv: 390, ethics: 300 },
    uk:  { nlp: 380, cv: 410, ethics: 320 },
    usa: { nlp: 400, cv: 430, ethics: 330 },
    de:  { nlp: 370, cv: 405, ethics: 310 },
  },
};

const COLORS = {
  primary: "#5B5CE2",      // NLP
  secondary: "#6BC2FF",    // CV
  accent: "#E35BBE",       // AI Ethics
  border: "#E5E7EB",
  subtext: "#6B7280",
  text: "#1F2340",
};

export default function ExplorerVisualisation() {
  const { type, id } = useParams(); // e.g. /explorer/visualisation/role/:id  或  /visualisation/skill/:id
  const nav = useNavigate();

  // 如果从 rank-role 进来，type=role，id=角色；从 rank-skill 进来时设置也默认给个角色
  const initialRole = type === "role" ? id : "site-eng";
  const [role, setRole] = useState(initialRole);

  // 默认比较四个国家，允许多选
  const [selectedCountries, setSelectedCountries] = useState(COUNTRIES.map(c => c.id));

  // 当前数据片段
  const rows = useMemo(() => {
    const rdata = DATA[role] || {};
    return selectedCountries.map(cid => ({
      cid,
      label: COUNTRIES.find(c => c.id === cid)?.label || cid,
      ...rdata[cid],
    }));
  }, [role, selectedCountries]);

  // 多选处理
  const toggleCountry = (cid) => {
    setSelectedCountries(prev =>
      prev.includes(cid) ? prev.filter(x => x !== cid) : [...prev, cid]
    );
  };

  // 极简柱状图（纯 div），三系列对齐
  const maxVal = 600;
  const bar = (val) => Math.max(6, Math.round((val / maxVal) * 240));

  return (
    <div style={{ padding: "24px 28px", color: COLORS.text }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>AI Skill Demand by Country</h1>
        <button
          onClick={() => alert("Export (static)")}
          style={{
            background: COLORS.primary,
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 16px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(91,92,226,0.36)",
          }}
        >
          Export
        </button>
      </div>

      {/* 筛选区 */}
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12, marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 14, color: COLORS.subtext, marginRight: 8 }}>Filter role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            aria-label="Select role"
            style={{
              background: "#EEF2FF",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              padding: "6px 10px",
              fontWeight: 600,
            }}
          >
            {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </div>

        <div>
          <span style={{ fontSize: 14, color: COLORS.subtext, marginRight: 8 }}>Compared Countries:</span>
          {COUNTRIES.map(c => (
            <label key={c.id} style={{ marginRight: 10, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={selectedCountries.includes(c.id)}
                onChange={() => toggleCountry(c.id)}
                style={{ marginRight: 6 }}
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* 图表卡片 */}
      <div style={{
        marginTop: 8,
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 16,
      }}>
        {/* 图例 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 8, alignItems: "center" }}>
          <Legend color={COLORS.primary}   label="NLP" />
          <Legend color={COLORS.secondary} label="Computer Vision" />
          <Legend color={COLORS.accent}    label="AI Ethics" />
        </div>

        {/* 柱状图区域 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${rows.length},1fr)`,
          gap: 18,
          alignItems: "end",
          height: 280,
          marginTop: 10,
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: 12,
        }}>
          {rows.map(r => (
            <div key={r.cid} style={{ display: "grid", gridTemplateRows: "1fr auto", gap: 8 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "end", height: "100%" }}>
                <div title={`NLP: ${r.nlp}`}    style={{ width: 18, height: bar(r.nlp),    background: COLORS.primary,   borderRadius: 6 }} />
                <div title={`CV: ${r.cv}`}      style={{ width: 18, height: bar(r.cv),      background: COLORS.secondary, borderRadius: 6 }} />
                <div title={`AI Ethics: ${r.ethics}`} style={{ width: 18, height: bar(r.ethics), background: COLORS.accent,    borderRadius: 6 }} />
              </div>
              <div style={{ textAlign: "center", fontSize: 12, color: COLORS.subtext }}>{r.label}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: COLORS.subtext }}>
          <strong>Insight</strong> — Placeholder insight text; align with HiFi narrative.
        </div>
      </div>

      {/* 返回 */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => nav(-1)}
          style={{
            background: "#fff",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
      {label}
    </span>
  );
}

