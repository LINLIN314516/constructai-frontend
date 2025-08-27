import React, { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  // 需求趋势（两条线，主线与参考线）
  const trendData = [
    { month: 1, main: 30, ref: 18 },
    { month: 2, main: 40, ref: 22 },
    { month: 3, main: 36, ref: 25 },
    { month: 4, main: 55, ref: 28 },
    { month: 5, main: 54, ref: 33 },
    { month: 6, main: 70, ref: 31 },
  ];

  // 热门技能数据
  const topSkills = [
    { name: "Computer Vision", jobs: 120 },
    { name: "Natural Language Processing", jobs: 79 },
  ];

  const [selectedRegion] = useState("VIC");
  const [lastUpdated] = useState("May 2025");

  return (
    <div className="dash-page">
      {/* 标题行 */}
      <div className="dash-header">
        <h1>AI/ML Skills Demand Overview</h1>
        <div className="dash-period">
          <span className="pill">{lastUpdated}</span>
          <button className="pill pill-icon" aria-label="toggle period">▾</button>
        </div>
      </div>

      {/* 指标卡片区 */}
      <section className="dash-card dash-keymetrics">
        <div className="card-title">Key Metrics</div>
        <div className="km-grid">
          <div className="km-item">
            <div className="km-label">Top Skill</div>
            <div className="km-body">
              <span className="km-icon">⚙️</span>
              <span className="km-text">Python</span>
            </div>
          </div>
          <div className="km-item">
            <div className="km-label">Demand</div>
            <div className="km-body">
              <span className="km-icon up">↑</span>
              <span className="km-text">12.5%</span>
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
          <div className="map-box">
            <img src="/images/AusMap.png" alt="Australia Map" className="map-img" />
          </div>
        </div>
        <div>
          <div className="block-title">Demand Trends</div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <Line type="monotone" dataKey="main" stroke="#3a2fb1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ref" stroke="#b7b2ee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top In-Demand Skills */}
      <section className="dash-bottom">
        <div className="block-title">Top In-Demand Skills</div>
        <div className="skills-list">
          {topSkills.map((skill, index) => (
            <div key={skill.name} className="skill-row">
              <span className="skill-index">{index + 1}.</span>
              <span className="skill-name">{skill.name}</span>
              <span className="skill-jobs">+{skill.jobs} jobs</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

