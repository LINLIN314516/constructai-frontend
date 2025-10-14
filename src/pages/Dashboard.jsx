import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://73fgxcxzz9.execute-api.ap-southeast-2.amazonaws.com";

const num = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);
const niceCeil = (n, step = 100) => Math.ceil(n / step) * step;

// 时间范围转换函数
const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

function rangeToDates(preset) {
  const monthsMap = { "1m": 1, "3m": 3, "6m": 6, "12m": 12 };
  const months = monthsMap[preset] ?? 6; // 默认6个月
  const to = new Date();
  to.setHours(0, 0, 0, 0);
  const from = new Date(to);
  from.setMonth(from.getMonth() - months);
  return { date_from: fmt(from), date_to: fmt(to) };
}

// 获取 Top 10 技能数据
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


export default function Dashboard() {
  const navigate = useNavigate();

  // 数据状态
  const [topSkills, setTopSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedRegion] = useState("VIC");
  const [lastUpdated] = useState("May 2025");

  // 点击澳洲地图跳转到 Heatmap 澳大利亚详细页面（3 Months 模式）
  const handleAustraliaMapClick = () => {
    // 跳转到 Heatmap 页面，并设置为澳大利亚视图和 3 Months 模式
    navigate('/heatmap?view=australia&timeSlot=3Months');
  };

  // 获取 Top 10 技能数据
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const { date_from, date_to } = rangeToDates("6m"); // 默认6个月
        const data = await fetchTopDemand({ mode: "skill", limit: 10, date_from, date_to });
        
        if (!aborted) {
          const list = data
            .sort((a, b) => (b.totalCount ?? 0) - (a.totalCount ?? 0))
            .map((x) => ({ name: x.name, jobs: x.totalCount }));
          setTopSkills(list);
        }
      } catch (e) {
        if (!aborted) setError(e?.message || "Failed to fetch top skills data");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, []);

  // 计算需求增长率（基于 Top 10 技能的总需求量）
  const demandGrowth = useMemo(() => {
    if (topSkills.length === 0) return 0;
    // 这里可以基于历史数据计算增长率，暂时使用模拟值
    return 12.5; // 模拟增长率
  }, [topSkills]);

  // 获取排名第一的技能
  const topSkill = topSkills.length > 0 ? topSkills[0].name : "Python";

  // Top 2 技能（用于底部显示）
  const top2Skills = topSkills.slice(0, 2);

  // 颜色配置
  const skillColors = ["#3a2fb1", "#6BC2FF", "#E35BBE", "#10B981", "#F59E0B", "#EF4444"];

  // ====== 条形图布局与坐标 ======
  const W = 500, H = 348; // 增加高度以填充整个卡片 (360px - 12px padding)
  const PAD = { l: 80, r: 16, t: 20, b: 20 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  // 计算条形图数据
  const maxJobs = topSkills.length > 0 ? Math.max(...topSkills.map(s => s.jobs)) : 100;
  const xScale = (value) => {
    return PAD.l + (value / maxJobs) * innerW;
  };

  // 优化条形分布，使其更均匀地填充空间
  const totalBars = topSkills.length;
  const availableHeight = innerH;
  const barHeight = Math.min(availableHeight / totalBars * 0.75, 28); // 使用75%的空间，最大28px
  const totalBarHeight = totalBars * barHeight;
  const remainingSpace = availableHeight - totalBarHeight;
  const barSpacing = remainingSpace / (totalBars + 1);

  return (
    <div className="dash-page">
      {/* 标题行 */}
      <div className="dash-header">
        <h1>AI/ML Skills Demand Overview</h1>
      </div>

      {/* Loading 和 Error 提示 */}
      {loading && (
        <div style={{ padding: "12px", background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "8px", marginBottom: "16px" }}>
          Loading...
        </div>
      )}
      {error && (
        <div style={{ padding: "12px", background: "#fff5f5", border: "1px solid #f2b8b8", borderRadius: "8px", marginBottom: "16px", color: "#8a1c1c" }}>
          错误: {error}
        </div>
      )}

      {/* 指标卡片区 */}
      <section className="dash-card dash-keymetrics">
        <div className="card-title">Key Metrics</div>
        <div className="km-grid">
          <div className="km-item">
            <div className="km-label">Top Skill</div>
            <div className="km-body">
              <span className="km-icon">⚙️</span>
              <span className="km-text">{topSkill}</span>
            </div>
          </div>
          <div className="km-item">
            <div className="km-label">Demand</div>
            <div className="km-body">
              <span className={`km-icon ${demandGrowth >= 0 ? 'up' : 'down'}`}>
                {demandGrowth >= 0 ? '↑' : '↓'}
              </span>
              <span className="km-text">{Math.abs(demandGrowth).toFixed(1)}%</span>
            </div>
          </div>
          <div className="km-item">
            <div className="km-label">Region</div>
            <div className="km-body">
              <span className="km-icon">📍</span>
              <span className="km-text">{selectedRegion}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 地图与趋势 */}
      <div className="dash-row">
        <div>
          <div className="block-title">Regional Heatmap</div>
          <div className="map-box" onClick={handleAustraliaMapClick} style={{ cursor: 'pointer' }}>
            <img src="/images/AusMap.png" alt="Australia Map" className="map-img" />
          </div>
        </div>
        <div>
          <div className="block-title">Top 10 Most Demand AI/ML Skills</div>
          <div className="chart-box">
            {topSkills.length > 0 ? (
              <svg width={W} height={H} role="img" aria-label="Top 10 AI/ML Skills bar chart">
                {/* 背景网格线 */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const x = PAD.l + ratio * innerW;
                  return (
                    <line 
                      key={i}
                      x1={x} 
                      x2={x} 
                      y1={PAD.t} 
                      y2={PAD.t + innerH} 
                      stroke="#E5E7EB" 
                      strokeWidth="1"
                    />
                  );
                })}

                {/* 条形图 */}
                {topSkills.map((skill, index) => {
                  const y = PAD.t + barSpacing + index * (barHeight + barSpacing);
                  const barWidth = xScale(skill.jobs) - PAD.l;
                  const color = skillColors[index % skillColors.length];
                  
                  return (
                    <g key={skill.name}>
                      {/* 条形 */}
                      <rect
                        x={PAD.l}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill={color}
                        rx="2"
                      />
                      {/* 技能名称 */}
                      <text 
                        x={PAD.l - 8} 
                        y={y + barHeight/2 + 4} 
                        textAnchor="end" 
                        fontSize="11" 
                        fill="#374151"
                        fontWeight="500"
                      >
                        {skill.name}
                      </text>
                      {/* 数值标签 */}
                      <text 
                        x={PAD.l + barWidth + 8} 
                        y={y + barHeight/2 + 4} 
                        fontSize="10" 
                        fill="#6B7280"
                      >
                        {skill.jobs.toLocaleString()}
                      </text>
                    </g>
                  );
                })}

              </svg>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '348px', color: '#6B7280' }}>
                No data yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top In-Demand Skills */}
      <section className="dash-bottom">
        <div className="block-title">Top In-Demand Skills</div>
        <div className="skills-list">
          {top2Skills.length > 0 ? (
            top2Skills.map((skill, index) => (
              <div key={skill.name} className="skill-row">
                <span className="skill-index">{index + 1}.</span>
                <span className="skill-name">{skill.name}</span>
                <span className="skill-jobs">+{skill.jobs} jobs</span>
              </div>
            ))
          ) : (
            <div style={{ color: '#6B7280', padding: '12px' }}>No data yet.</div>
          )}
        </div>
      </section>
    </div>
  );
}

