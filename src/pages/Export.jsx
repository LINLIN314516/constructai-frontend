import React, { useState } from "react";

// 五个国家的数据配置
const countryData = {
  canada: {
    name: "Canada",
    flag: "🇨🇦",
    buildingCount: "10",
    peopleCount: "4,281",
    insights: [
      "Around 4,281 construction positions in Canada now require AI/ML skills — accounting for 3.7% of technical and management roles.",
      "Over the past 3 years, job postings mentioning AI/ML have increased by 42%, with the fastest growth in Ontario and British Columbia."
    ],
    skills: [
      "BIM with AI integration (31%)",
      "Predictive maintenance & sensor analytics (24%)",
      "Automated construction management (18%)",
      "Computer vision-assisted inspection (16%)",
      "ML-driven supply chain optimization (11%)"
    ]
  },
  usa: {
    name: "United States",
    flag: "🇺🇸",
    buildingCount: "26",
    peopleCount: "27,360",
    insights: [
      "Approx. 27,360 professionals in USA's construction sector work in AI/ML roles, about 4.4% of technical positions.",
      "Job postings rose 53% in 3 years, led by California, Texas, and New York through smart city initiatives."
    ],
    skills: [
      "BIM with AI integration (30%)",
      "Predictive maintenance & sensor analytics (23%)",
      "Automated construction scheduling & robotics (19%)",
      "Computer vision for infrastructure inspection (16%)",
      "ML-based inventory & materials forecasting (12%)"
    ]
  },
  brazil: {
    name: "Brazil",
    flag: "🇧🇷",
    buildingCount: "26",
    peopleCount: "27,360",
    insights: [
      "Approx. 27,360 professionals in Brazil's construction sector work in AI/ML roles, about 4.4% of technical positions.",
      "Job postings rose 53% in 3 years, led by São Paulo, Rio de Janeiro, and Brasília through smart city initiatives."
    ],
    skills: [
      "BIM with AI integration (30%)",
      "Predictive maintenance & sensor analytics (23%)",
      "Automated construction scheduling & robotics (19%)",
      "Computer vision for infrastructure inspection (16%)",
      "ML-based inventory & materials forecasting (12%)"
    ]
  },
  india: {
    name: "India",
    flag: "🇮🇳",
    buildingCount: "16",
    peopleCount: "27,360",
    insights: [
      "Approx. 27,360 construction professionals in India work in AI/ML-related roles, making up 6.2% of the technical workforce.",
      "Job postings have grown by 65% in the past 3 years, especially in Bangalore, Mumbai, and Hyderabad."
    ],
    skills: [
      "AI-enhanced BIM & 3D modeling (28%)",
      "AI-powered safety & risk prediction systems (25%)",
      "Automation in construction workflows (20%)",
      "Drone-based site monitoring with ML analytics (15%)",
      "AI-driven quality inspection & reporting (12%)"
    ]
  },
  australia: {
    name: "Australia",
    flag: "🇦🇺",
    buildingCount: "21",
    peopleCount: "16,001",
    insights: [
      "An estimated 16,001 professionals in Australia's construction sector hold roles requiring AI/ML skills, representing about 5.1% of relevant technical and project-focused positions.",
      "Over the last 3 years, AI/ML-related job postings have risen by 47%, particularly in New South Wales, Victoria, and Queensland."
    ],
    skills: [
      "BIM with AI integration (29%)",
      "Predictive maintenance & sensor analytics (26%)",
      "Automated construction management (20%)",
      "Computer vision for inspections (14%)",
      "AI-enhanced logistics & supply chain tools (11%)"
    ]
  }
};

export default function ExportPage(){
  const [selectedCountry, setSelectedCountry] = useState('canada');
  const [showBubble, setShowBubble] = useState(false);

  return (
    <div className="insights-page">
      <div className="insights-grid">
        {/* 左侧世界地图 */}
        <section className="insights-map">
          <img src="/images/InsightsMap.png" alt="Regional insights map" />
          
          {/* 五个国家的点击区域 - Regional Insights 专用 */}
          <div className="insights-click-area insights-canada-area" onClick={() => {setSelectedCountry('canada'); setShowBubble(true);}}></div>
          <div className="insights-click-area insights-usa-area" onClick={() => {setSelectedCountry('usa'); setShowBubble(true);}}></div>
          <div className="insights-click-area insights-brazil-area" onClick={() => {setSelectedCountry('brazil'); setShowBubble(true);}}></div>
          <div className="insights-click-area insights-india-area" onClick={() => {setSelectedCountry('india'); setShowBubble(true);}}></div>
          <div className="insights-click-area insights-australia-area" onClick={() => {setSelectedCountry('australia'); setShowBubble(true);}}></div>
          
          {/* 动态气泡显示 */}
          {showBubble && (
            <div className={`insights-${selectedCountry}-bubble`}>
              <div className="bubble-header">
                <span className="flag">{countryData[selectedCountry].flag}</span>
                <span className="country">{countryData[selectedCountry].name}</span>
              </div>
              <div className="bubble-data">
                <div className="data-item">
                  <span className="icon">🏗️</span>
                  <span className="value">{countryData[selectedCountry].buildingCount}</span>
                </div>
                <div className="data-item">
                  <span className="icon">👤</span>
                  <span className="value">{countryData[selectedCountry].peopleCount}</span>
                </div>
              </div>
              <button className="bubble-close" onClick={() => setShowBubble(false)}>×</button>
            </div>
          )}
        </section>

        {/* 右侧信息卡片 */}
        <aside className="insights-panel">
          <h2>{countryData[selectedCountry].name}</h2>
          <div className="ins-panel-body">
            <div className="ins-item">
              <span className="emoji">📊</span>
              <div>
                <div className="ins-title">Recent Insights from {countryData[selectedCountry].name}'s Construction Industry</div>
              </div>
            </div>

            {countryData[selectedCountry].insights.map((insight, index) => (
              <div key={index} className="ins-item">
                <span className="emoji">{index === 0 ? "📌" : "🗂️"}</span>
                <div>{insight}</div>
              </div>
            ))}

            <div className="ins-list">
              <div className="list-title">Top in-demand AI/ML skills:</div>
              <ul>
                {countryData[selectedCountry].skills.map((skill, index) => (
                  <li key={index}>
                    {index === 0 && "🧱 "}
                    {index === 1 && "🛠️ "}
                    {index === 2 && "🤖 "}
                    {index === 3 && "🛰️ "}
                    {index === 4 && "💽 "}
                    {skill}
                  </li>
                ))}
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