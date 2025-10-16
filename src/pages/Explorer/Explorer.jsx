// Explorer.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Use two different APIs / 使用两个不同的API
const API_BASE = "https://73fgxcxzz9.execute-api.ap-southeast-2.amazonaws.com";
// 修复：移除末尾的 /available-states，因为我们会在 fetch 时追加路径
const JOBS_API_BASE = "https://5s7x05ihle.execute-api.ap-southeast-2.amazonaws.com/development";

const COLORS = {
  card: "var(--ca-card, #F7F7FC)",
  border: "var(--ca-border, #E5E7EB)",
  text: "var(--ca-text, #1F2340)",
  sub: "var(--ca-subtext, #6B7280)",
  primary: "var(--ca-primary, #5B5CE2)",
};

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

// Get full state name / 获取州的完整名称
function getStateName(stateCode) {
  const stateNames = {
    'VIC': 'Victoria',
    'NSW': 'New South Wales',
    'QLD': 'Queensland',
    'WA': 'Western Australia',
    'SA': 'South Australia',
    'TAS': 'Tasmania',
    'ACT': 'Australian Capital Territory',
    'NT': 'Northern Territory'
  };
  return stateNames[stateCode] || stateCode;
}

export default function Explorer() {
  const nav = useNavigate();

  // Skills (ranking + time range) / Skills（榜单 + 时间范围）
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsErr, setSkillsErr] = useState(null);
  const [skillsRange, setSkillsRange] = useState("1m");

  // Job titles (ranking + time range) / Job titles（榜单 + 时间范围）
  const [jobTitles, setJobTitles] = useState([]);
  const [jtLoading, setJtLoading] = useState(true);
  const [jtErr, setJtErr] = useState(null);
  const [jtRange, setJtRange] = useState("1m");

  // Regions - dynamic region data / Regions - 动态地区数据
  const [regions, setRegions] = useState([]);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [regionsError, setRegionsError] = useState(null);
  const [regionsRange, setRegionsRange] = useState("1m");
  const [availableStates, setAvailableStates] = useState([]);

  // Fetch Top 10 skills (using original API) / 拉取 Top 10 skills（使用原有API）
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

  // Fetch Top 10 job titles (using original API) / 拉取 Top 10 job titles（使用原有API）
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

  // Fetch region data (using new Jobs API) / 拉取地区数据（使用新的Jobs API）
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setRegionsLoading(true);
        setRegionsError(null);
        
        console.log('=== Starting to fetch region data / 开始获取地区数据 ===');
        
        // 1. Get available states / 获取可用的州
        // 修复：正确拼接 URL
        const statesUrl = `${JOBS_API_BASE}/available-states`;
        console.log('Calling available-states API...', statesUrl);
        
        const statesResponse = await fetch(statesUrl, {
          headers: { Accept: "application/json" }
        });
        console.log('available-states response status / 响应状态:', statesResponse.status);
        
        if (!statesResponse.ok) {
          throw new Error(`available-states API error / API返回错误: ${statesResponse.status}`);
        }
        
        const states = await statesResponse.json();
        console.log('States retrieved / 获取到的州列表:', states);
        
        if (aborted) return;
        setAvailableStates(states);
        
        // 2. Get data for each state / 为每个州获取数据
        const regionsList = [];
        
        for (const state of states) {
          try {
            const jobsUrl = `${JOBS_API_BASE}/jobs?state=${state}`;
            console.log(`Fetching data for ${state}...`, jobsUrl);
            
            const jobsResponse = await fetch(jobsUrl, {
              headers: { Accept: "application/json" }
            });
            console.log(`${state} response status / 数据响应状态:`, jobsResponse.status);
            
            if (!jobsResponse.ok) {
              console.error(`Failed to fetch ${state} data / 获取 ${state} 数据失败: HTTP ${jobsResponse.status}`);
              continue;
            }
            
            const jobs = await jobsResponse.json();
            console.log(`${state} retrieved ${jobs.length} job records / 获取到 ${jobs.length} 条职位数据`);
            
            // Process data / 处理数据
            const skills = {};
            let totalCount = 0;
            
            jobs.forEach(job => {
              if (job.Skill) {
                skills[job.Skill] = (skills[job.Skill] || 0) + (job.Count || 0);
              }
              totalCount += (job.Count || 0);
            });
            
            // Find top skill / 找出最热门的技能
            const topSkill = Object.entries(skills)
              .sort((a, b) => b[1] - a[1])[0];
            
            // Add to regions list / 添加到地区列表
            regionsList.push({
              id: state,
              name: `${getStateName(state)}, Australia`,
              top: topSkill ? topSkill[0] : 'N/A',
              demand: totalCount > 0 ? `${totalCount} jobs` : 'No data'
            });
            
            console.log(`${state} processing complete / 处理完成:`, {
              topSkill: topSkill ? topSkill[0] : 'N/A',
              totalJobs: totalCount
            });
            
          } catch (error) {
            console.error(`Error processing ${state} data / 处理 ${state} 数据时出错:`, error);
          }
        }
        
        if (aborted) return;
        
        console.log('Final regions list / 最终的地区列表:', regionsList);
        setRegions(regionsList);
        
      } catch (e) {
        if (!aborted) {
          console.error('Failed to fetch region data / 获取地区数据失败:', e);
          setRegionsError(e.message || 'Failed to fetch region data');
          setRegions([]);
        }
      } finally {
        if (!aborted) {
          setRegionsLoading(false);
          console.log('=== Region data fetch complete / 地区数据获取完成 ===');
        }
      }
    })();
    return () => {
      aborted = true;
    };
  }, [regionsRange]);

  return (
    <div style={{ padding: 24, color: COLORS.text }}>
      <h1 style={{ marginTop: 0 }}>Construction Explorer</h1>

      {/* 1) Top section: Top 10 skills / 顶部：Top 10 skills */}
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

      {/* 2) Middle section: Regions (dynamic data) / 中间：Regions（动态数据） */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h3 style={{ marginBottom: 8 }}>
            Top {regions.length || '?'} Most Viewed Regions
          </h3>
          {regionsLoading && <span style={{ fontSize: 12, color: COLORS.sub }}>(loading…)</span>}
          {regionsError && <span style={{ fontSize: 12, color: "#b4232c" }}>({regionsError})</span>}
        </div>
        <RangeSelect value={regionsRange} onChange={setRegionsRange} />
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {regions.length > 0 ? (
          regions.map((r) => (
            <Card
              key={r.id}
              title={r.name}
              meta={`Top skill: ${r.top} · ${r.demand}`}
              onClick={() => nav(`/explorer/region/${r.id}`)}
            />
          ))
        ) : (
          !regionsLoading && (
            <div style={{ gridColumn: "1 / -1", color: COLORS.sub, fontSize: 13 }}>
              {regionsError ? `Error: ${regionsError}` : 'No regions data available.'}
            </div>
          )
        )}
      </div>

      {/* 3) Bottom section: Top 10 job titles / 底部：Top 10 job titles */}
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




