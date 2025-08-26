import React, { useState } from "react";

export default function ExportPage(){
  const [showBubble, setShowBubble] = useState(false);

  return (
    <div className="insights-page">
      <div className="insights-grid">
        {/* 左侧世界地图 */}
        <section className="insights-map">
          <img src="/images/InsightsMap.png" alt="Regional insights map" />
          {/* 点击区域 */}
          <div className="map-click-area" onClick={() => setShowBubble(true)}></div>
          
          {/* 加拿大气泡 */}
          {showBubble && (
            <div className="canada-bubble">
              <div className="bubble-header">
                <span className="flag">🇨🇦</span>
                <span className="country">Canada</span>
              </div>
              <div className="bubble-data">
                <div className="data-item">
                  <span className="icon">🏗️</span>
                  <span className="value">10</span>
                </div>
                <div className="data-item">
                  <span className="icon">👤</span>
                  <span className="value">4,281</span>
                </div>
              </div>
              <button className="bubble-close" onClick={() => setShowBubble(false)}>×</button>
            </div>
          )}
        </section>

        {/* 右侧信息卡片 */}
        <aside className="insights-panel">
          <h2>Canada</h2>
          <div className="ins-panel-body">
            <div className="ins-item">
              <span className="emoji">📊</span>
              <div>
                <div className="ins-title">Recent Insights from Canada's Construction Industry</div>
              </div>
            </div>

            <div className="ins-item">
              <span className="emoji">📌</span>
              <div>
                Around 4,281 construction positions in Canada now require AI/ML skills — accounting for 3.7% of technical and management roles.
              </div>
            </div>

            <div className="ins-item">
              <span className="emoji">🗂️</span>
              <div>
                Over the past 3 years, job postings mentioning AI/ML have increased by 42%, with the fastest growth in Ontario and British Columbia.
              </div>
            </div>

            <div className="ins-list">
              <div className="list-title">Top in-demand AI/ML skills:</div>
              <ul>
                <li>🧱 BIM with AI integration (31%)</li>
                <li>🛠️ Predictive maintenance & sensor analytics (24%)</li>
                <li>🤖 Automated construction management (18%)</li>
                <li>🛰️ Computer vision–assisted inspection (16%)</li>
                <li>💽 ML-driven supply chain optimization (11%)</li>
              </ul>
            </div>

            <div className="ins-note">🧪 Generated using AI based on project trends and synthesized data. Not official government statistics.</div>
          </div>

          <div className="ins-actions">
            <button className="export-btn" onClick={()=>alert("Export ok")}>Export</button>
          </div>
        </aside>
      </div>
    </div>
  );
}