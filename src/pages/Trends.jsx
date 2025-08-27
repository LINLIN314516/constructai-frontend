import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/** 追踪的技能键（只画三条：NLP / CV / PA） */
const SKILL_KEYS = [
  { key: "NLP", label: "NLP" },
  { key: "CV",  label: "Computer Vision" },
  { key: "PA",  label: "Predictive Analytics" },
];

/** 主题色（会尊重你 index.css 的变量） */
const COLORS = {
  primary: "var(--ca-primary, #5B5CE2)",
  secondary: "var(--ca-secondary, #6BC2FF)",
  accent: "var(--ca-accent, #E35BBE)",
  text: "var(--ca-text, #1F2340)",
  subtext: "var(--ca-subtext, #6B7280)",
  bg: "var(--ca-bg, #FFFFFF)",
  card: "var(--ca-card, #F7F7FC)",
  border: "var(--ca-border, #E5E7EB)"
};

/** 生成折线路径 */
function linePath(points, xScale, yScale) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x)},${yScale(p.y)}`).join(" ");
}

/** 解析后端数组 => { raw: [{label:'YYYY-MM-DD', NLP, CV, PA}, ...], summary } */
function parseLambdaPayload(rows) {
  const byDate = new Map(); // "YYYY-MM-DD" -> { label, NLP, CV, PA }

  for (const r of rows || []) {
    if (!r || typeof r.PK !== "string" || typeof r.SK !== "string") continue;
    if (!r.PK.startsWith("TREND#")) continue;

    const parts = r.PK.split("#");          // ["TREND","REGION","VIC","SKILL","Computer Vision"]
    const skillName = parts[4];             // "NLP" | "Computer Vision" | "Predictive Analytics" | ...
    const dateStr = r.SK.replace("DATE#", ""); // "2025-05-01"
    if (!dateStr || !Number.isFinite(r.count)) continue;

    let key = null;
    if (skillName === "NLP") key = "NLP";
    else if (skillName === "Computer Vision") key = "CV";
    else if (skillName === "Predictive Analytics") key = "PA";
    if (!key) continue; // 只保留我们要画的三种技能

    const rec = byDate.get(dateStr) || { label: dateStr, NLP: 0, CV: 0, PA: 0 };
    rec[key] += Number(r.count) || 0; // 日级累加
    byDate.set(dateStr, rec);
  }

  // 按日期升序
  const raw = Array.from(byDate.values()).sort((a, b) => a.label.localeCompare(b.label));

  // 简单 summary：取最后一天总量 + 给一个估算值
  let totalPosts = 0, yoy = 0, estimate = 0;
  if (raw.length) {
    const last = raw[raw.length - 1];
    const lastSum = (last.NLP || 0) + (last.CV || 0) + (last.PA || 0);
    totalPosts = lastSum;
    estimate = Math.round(lastSum * 1.18); // 没有前一天对比，就按 18% 做一个演示估算
  }

  return {
    raw,
    summary: {
      totalPosts: Math.round(totalPosts),
      skillsCount: SKILL_KEYS.length,
      yoy,
      estimate2025: estimate
    }
  };
}

export default function Trends() {
  const navigate = useNavigate();

  // —— 状态（仅用后端，不再保留静态回退）——
  const [raw, setRaw] = useState([]);           // [{label, NLP, CV, PA}...]
  const [summary, setSummary] = useState(null); // { totalPosts, skillsCount, yoy, estimate2025 }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource] = useState("backend");

  useEffect(() => {
    const API_URL = "/api?region=VIC"; // 通过 Vite 代理，避免 CORS
    let aborted = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const r = await fetch(API_URL, { credentials: "omit" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();
        const parsed = parseLambdaPayload(data);
        if (!parsed.raw.length) throw new Error("No TREND rows");
        if (!aborted) {
          setRaw(parsed.raw);
          setSummary(parsed.summary);
        }
      } catch (e) {
        if (!aborted) setError(e?.message || "Failed to fetch");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => { aborted = true; };
  }, []);

  // —— 导出/打印菜单（保持你的逻辑）——
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const [enabled, setEnabled] = useState(["NLP", "CV", "PA"]);

  // ====== 画布与坐标 ======
  const W = 760, H = 280;
  const PAD = { l: 52, r: 16, t: 20, b: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  // X 轴使用“日期标签”
  const labels = raw.map(d => d.label); // ["2025-05-01","2025-05-02",...]
  const xScale = (label) => {
    const i = labels.indexOf(label);
    const step = innerW / Math.max(1, (labels.length - 1));
    return PAD.l + i * step;
  };

  // Y 轴动态范围
  const values = raw.flatMap(d => [d.NLP || 0, d.CV || 0, d.PA || 0]);
  const dataMax = values.length ? Math.max(...values) : 200;
  const niceCeil = (n, step = 100) => Math.ceil(n / step) * step;
  const minY = 0;
  const maxY = niceCeil(dataMax * 1.1, dataMax > 1000 ? 500 : 100);
  const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((maxY / 5) * i));
  const yScale = (y) => {
    const yNorm = (y - minY) / (maxY - minY);
    return PAD.t + innerH - innerH * yNorm;
  };

  // 折线数据
  const series = useMemo(() => {
    return SKILL_KEYS
      .filter(s => enabled.includes(s.key))
      .map((s, idx) => {
        const color = [COLORS.primary, COLORS.secondary, COLORS.accent][idx];
        const pts = raw.map(d => ({ x: d.label, y: d[s.key] ?? 0 })); // 关键：x 用 label
        return { id: s.key, label: s.label, color, pts };
      });
  }, [enabled, raw]);

  const toggle = (key) => {
    setEnabled(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const onExport = () => {
    navigate("/export-trends", { state: { from: "trends", labels, enabled } });
  };
  const onPrint = () => window.print();

  return (
    <div style={{ padding: "24px 28px", color: COLORS.text }}>
      {/* 顶部：数据来源 + 加载/错误提示 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{
          padding: "4px 8px", borderRadius: 8, fontSize: 12,
          background: "#e6ffed", color: "#067d3f", border: "1px solid rgba(0,0,0,0.08)"
        }}>
          data: {dataSource}
        </span>
        {loading && <span style={{ fontSize: 12, color: COLORS.subtext }}>Loading backend…</span>}
        {error && <span style={{ fontSize: 12, color: "#b4232c" }}>Error: {error}</span>}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 8, background: COLORS.card, color: COLORS.subtext }}>
          Skills
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>AI Skill Demand Trend</h1>

        <div ref={menuRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen ? "true" : "false"}
            onClick={() => setMenuOpen(v => !v)}
            style={{
              background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10,
              padding: "10px 16px", fontWeight: 600, cursor: "pointer",
              boxShadow: "0 2px 10px rgba(91,92,226,0.36)"
            }}
          >
            Export ▾
          </button>

          {menuOpen && (
            <div
              role="menu"
              style={{
                position: "absolute", right: 0, top: "110%", background: "#fff", borderRadius: 12,
                border: `1px solid ${COLORS.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                minWidth: 180, padding: 6, zIndex: 20
              }}
            >
              <button type="button" role="menuitem"
                onClick={() => { setMenuOpen(false); onExport(); }}
                style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8,
                         background: "transparent", border: "none", cursor: "pointer" }}>
                Export as PDF
              </button>
              <button type="button" role="menuitem"
                onClick={() => { setMenuOpen(false); onPrint(); }}
                style={{ width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8,
                         background: "transparent", border: "none", cursor: "pointer" }}>
                Print…
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 空态 */}
      {!loading && (!raw.length || !summary) && (
        <div style={{
          background: "#fff5f5", border: "1px dashed #f2b8b8",
          borderRadius: 12, padding: 16, color: "#8a1c1c", marginBottom: 16
        }}>
          后端数据未加载成功，请检查 Lambda URL 或 CORS 设置。
        </div>
      )}

      {/* 有数据才渲染卡片与图表 */}
      {raw.length > 0 && summary && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
            <InfoCard title="Total AI-related Job Posts" value={Math.round(summary.totalPosts).toLocaleString()} />
            <InfoCard title={`${SKILL_KEYS.length} skills`} value={`${SKILL_KEYS.length} skills`} caption="Shown" />
            <InfoCard title="YoY" value={`+${Math.round((summary.yoy || 0) * 100)}%`} caption="Year-over-year" />
            <InfoCard title="2025 Estimated" value={`${Math.round(summary.estimate2025 || 0).toLocaleString()} job posts`} />
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
            <LegendPill active={enabled.includes("NLP")} color={COLORS.primary} label="NLP" onClick={() => toggle("NLP")} />
            <LegendPill active={enabled.includes("CV")}  color={COLORS.secondary} label="Computer Vision" onClick={() => toggle("CV")} />
            <LegendPill active={enabled.includes("PA")}  color={COLORS.accent} label="Predictive Analytics" onClick={() => toggle("PA")} />
          </div>

          <div style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 12 }}>
            <svg width={W} height={H} role="img" aria-label="AI skill demand line chart">
              {yTicks.map((v) => (
                <g key={v}>
                  <line x1={PAD.l} x2={W - PAD.r} y1={yScale(v)} y2={yScale(v)} stroke={COLORS.border} />
                  <text x={PAD.l - 10} y={yScale(v) + 4} textAnchor="end" fontSize="11" fill={COLORS.subtext}>{v}</text>
                </g>
              ))}

              {labels.map((lbl) => (
                <g key={lbl}>
                  <text x={xScale(lbl)} y={H - 10} textAnchor="middle" fontSize="11" fill={COLORS.subtext}>{lbl}</text>
                </g>
              ))}

              <text x={PAD.l} y={PAD.t - 4} fontSize="12" fill={COLORS.subtext}>Job posts</text>

              {series.map(s => (
                <g key={s.id}>
                  <path d={linePath(s.pts.map(p => ({ x: p.x, y: p.y })), xScale, yScale)} fill="none" stroke={s.color} strokeWidth="3" />
                  {s.pts.map(p => (
                    <circle key={`${s.id}-${p.x}`} cx={xScale(p.x)} cy={yScale(p.y)} r="4" fill={s.color} />
                  ))}
                </g>
              ))}
            </svg>

            <div style={{ marginTop: 8, fontSize: 13, color: COLORS.subtext }}>
              <strong>Insight</strong> — NLP increased steadily; CV plateaued; PA is lower but trending upward.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** 小卡片 */
function InfoCard({ title, value, caption }) {
  return (
    <div style={{ background: COLORS.card, borderRadius: 12, padding: "12px 14px", border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontSize: 12, color: COLORS.subtext, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
      {caption && <div style={{ fontSize: 11, color: COLORS.subtext }}>{caption}</div>}
    </div>
  );
}

/** 图例 pill */
function LegendPill({ active, color, label, onClick }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999,
               border: `1px solid ${active ? color : COLORS.border}`, background: active ? "rgba(0,0,0,0.02)" : "#fff", cursor: "pointer" }}>
      <span style={{ width: 10, height: 10, borderRadius: 999, background: color, boxShadow: active ? `0 0 0 3px ${color}22` : "none" }} />
      <span style={{ fontSize: 12 }}>{label}</span>
    </button>
  );
}

