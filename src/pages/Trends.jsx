import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchInsights } from "../api/services/jobInsightsApi";

// 主题色
const COLORS = {
  primary:   "var(--ca-primary, #5B5CE2)",
  secondary: "var(--ca-secondary, #6BC2FF)",
  accent:    "var(--ca-accent, #E35BBE)",
  text:      "var(--ca-text, #1F2340)",
  subtext:   "var(--ca-subtext, #6B7280)",
  bg:        "var(--ca-bg, #FFFFFF)",
  card:      "var(--ca-card, #F7F7FC)",
  border:    "var(--ca-border, #E5E7EB)"
};

const niceCeil = (n, step = 100) => Math.ceil(n / step) * step;
const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

// 将后端返回的若干数组（TREND / DATE）合并为按日期的行，并动态收集技能列表
function buildTrendTable(allRows) {
  const byDate = new Map();
  const skills = new Set();

  for (const r of allRows || []) {
    // 1) TREND 记录：PK = TREND#REGION#...#SKILL#<Skill>，SK = DATE#YYYY-MM-DD
    if (r?.PK?.startsWith?.("TREND#")) {
      const skill = r.PK.split("#")[4];
      const date = (r.SK || "").replace("DATE#", "");
      if (!skill || !date) continue;
      skills.add(skill);
      const rec = byDate.get(date) || { label: date };
      rec[skill] = (rec[skill] || 0) + num(r.count);
      byDate.set(date, rec);
      continue;
    }
    // 2) DATE 记录：PK = DATE#YYYY-MM-DD，SK = COUNT#000480#SKILL#MLOps（兜底，把某天快照也并入）
    if (r?.PK?.startsWith?.("DATE#")) {
      const date = (r.PK || "").replace("DATE#", "");
      const parts = (r.SK || "").split("#"); // COUNT#000480#SKILL#MLOps
      const idx = parts.indexOf("SKILL");
      const skill = idx >= 0 ? parts[idx + 1] : null;
      if (!skill || !date) continue;
      skills.add(skill);
      const rec = byDate.get(date) || { label: date };
      // 不覆盖已有 TREND 值；仅在 TREND 缺失时作为兜底
      if (rec[skill] == null) rec[skill] = num(r.count);
      byDate.set(date, rec);
    }
  }

  const rows = [...byDate.values()].sort((a, b) => a.label.localeCompare(b.label));
  return { rows, skills: [...skills] };
}

// 生成折线路径
function linePath(points, xScale, yScale) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x)},${yScale(p.y)}`)
    .join(" ");
}

export default function Trends() {
  const navigate = useNavigate();

  // 页面状态
  const [rows, setRows] = useState([]);          // [{ label, <skillA>, <skillB>... }]
  const [skillKeys, setSkillKeys] = useState([]); // ["NLP","Computer Vision","MLOps",...]
  const [enabled, setEnabled] = useState([]);     // 当前显示哪些技能
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dataSource = "backend";

  // 可改成来自 UI 的筛选
  const REGION = "VIC";
  const DEFAULT_WATCH = ["NLP", "Computer Vision", "MLOps"]; // 想重点保证出现的技能

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) 先拉该地区整体（可能缺少部分技能的 TREND）
        const base = fetchInsights({ region: REGION });

        // 2) 再并行按技能补齐（保证 MLOps 之类也有 TREND）
        const skillReqs = DEFAULT_WATCH.map((s) => fetchInsights({ region: REGION, skill: s }));

        const results = await Promise.allSettled([base, ...skillReqs]);
        const all = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

        const { rows: chartRows, skills } = buildTrendTable(all);
        if (!aborted) {
          if (!chartRows.length) throw new Error("No TREND/DATE rows to build trend.");
          setRows(chartRows);

          // 动态技能：数据里有哪些就展示哪些
          const uniqueSkills = skills.length ? skills : DEFAULT_WATCH;
          setSkillKeys(uniqueSkills);
          setEnabled(uniqueSkills); // 默认全开

          // 顶部 KPI：取最后一天的总量
          const last = chartRows[chartRows.length - 1];
          const lastSum = uniqueSkills.reduce((acc, k) => acc + (last[k] || 0), 0);
          setSummary({
            totalPosts: Math.round(lastSum),
            skillsCount: uniqueSkills.length,
            yoy: 0, // 没有去年同日基线时先置 0
            estimate2025: Math.round(lastSum * 1.18),
          });
        }
      } catch (e) {
        if (!aborted) setError(e?.message || "Failed to fetch backend data");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, []);

  // ====== 图表布局与坐标 ======
  const W = 760, H = 280;
  const PAD = { l: 52, r: 16, t: 20, b: 36 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const labels = rows.map(d => d.label);
  const xScale = (label) => {
    const i = labels.indexOf(label);
    const step = innerW / Math.max(1, labels.length - 1);
    return PAD.l + i * step;
  };

  const allVals = rows.flatMap(d => skillKeys.map(k => d[k] || 0));
  const dataMax = allVals.length ? Math.max(...allVals) : 200;
  const minY = 0;
  const maxY = niceCeil(dataMax * 1.1, dataMax > 1000 ? 500 : 100);
  const yTicks = Array.from({ length: 6 }, (_, i) => Math.round((maxY / 5) * i));
  const yScale = (y) => {
    const yNorm = (y - minY) / (maxY - minY || 1);
    return PAD.t + innerH - innerH * yNorm;
  };

  // 计算折线序列（颜色循环）
  const series = useMemo(() => {
    const palette = [COLORS.primary, COLORS.secondary, COLORS.accent];
    return skillKeys
      .filter((k) => enabled.includes(k))
      .map((k, idx) => {
        const color = palette[idx % palette.length];
        const pts = rows.map((d) => ({ x: d.label, y: d[k] ?? 0 }));
        return { id: k, label: k, color, pts };
      });
  }, [enabled, rows, skillKeys]);

  // 交互：显隐某条线
  const toggle = (key) => {
    setEnabled(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  // 导出 / 打印
  const onExport = () => navigate("/export-trends", { state: { from: "trends", labels, enabled } });
  const onPrint  = () => window.print();

  // 导出菜单
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div style={{ padding: "24px 28px", color: COLORS.text }}>
      {/* 顶部：数据来源 / loading / 错误提示 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{
          padding: "4px 8px", borderRadius: 8, fontSize: 12,
          background: "#e6ffed", color: "#067d3f", border: "1px solid rgba(0,0,0,0.08)"
        }}>
          data: {dataSource}
        </span>
        {loading && <span style={{ fontSize: 12, color: COLORS.subtext }}>Loading backend…</span>}
        {error   && <span style={{ fontSize: 12, color: "#b4232c" }}>Error: {error}</span>}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 12, padding: "4px 8px", borderRadius: 8, background: COLORS.card, color: COLORS.subtext }}>
          Skills
        </span>
      </div>

      {/* 标题 + 导出菜单 */}
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
      {!loading && (!rows.length || !summary) && (
        <div style={{
          background: "#fff5f5", border: "1px dashed #f2b8b8",
          borderRadius: 12, padding: 16, color: "#8a1c1c", marginBottom: 16
        }}>
          Backend data not loaded. Please check Lambda URL / CORS.
        </div>
      )}

      {/* 有数据才渲染 */}
      {rows.length > 0 && summary && (
        <>
          {/* 顶部 KPI */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
            <InfoCard title="Total AI-related Job Posts" value={Math.round(summary.totalPosts).toLocaleString()} />
            <InfoCard title={`${skillKeys.length} skills`} value={`${skillKeys.length} skills`} caption="Shown" />
            <InfoCard title="YoY" value={`+${Math.round((summary.yoy || 0) * 100)}%`} caption="Year-over-year" />
            <InfoCard title="2025 Estimated" value={`${Math.round(summary.estimate2025 || 0).toLocaleString()} job posts`} />
          </div>

          {/* 图例 */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
            {skillKeys.map((key, idx) => (
              <LegendPill
                key={key}
                active={enabled.includes(key)}
                color={[COLORS.primary, COLORS.secondary, COLORS.accent][idx % 3]}
                label={key}
                onClick={() => toggle(key)}
              />
            ))}
          </div>

          {/* 折线图 */}
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
                  <path d={linePath(s.pts, xScale, yScale)} fill="none" stroke={s.color} strokeWidth="3" />
                  {s.pts.map(p => (
                    <circle key={`${s.id}-${p.x}`} cx={xScale(p.x)} cy={yScale(p.y)} r="4" fill={s.color} />
                  ))}
                </g>
              ))}
            </svg>

            <div style={{ marginTop: 8, fontSize: 13, color: COLORS.subtext }}>
              <strong>Insight</strong> — Trends reflect daily job-post counts for {REGION}. Change REGION or aggregate multiple regions to alter scope.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoCard({ title, value, caption }) {
  return (
    <div style={{ background: COLORS.card, borderRadius: 12, padding: "12px 14px", border: `1px solid ${COLORS.border}` }}>
      <div style={{ fontSize: 12, color: COLORS.subtext, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
      {caption && <div style={{ fontSize: 11, color: COLORS.subtext }}>{caption}</div>}
    </div>
  );
}

function LegendPill({ active, color, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px",
        borderRadius: 999, border: `1px solid ${active ? color : COLORS.border}`,
        background: active ? "rgba(0,0,0,0.02)" : "#fff", cursor: "pointer"
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 999, background: color, boxShadow: active ? `0 0 0 3px ${color}22` : "none" }} />
      <span style={{ fontSize: 12 }}>{label}</span>
    </button>
  );
}



