import { useNavigate } from "react-router-dom";

const MODULES = [
  { key: "heatmap", name: "Heatmap", uses: 165 },
  { key: "regional_insights", name: "Regional Insights", uses: 289 },
  { key: "demand_trends", name: "Demand Trends", uses: 268 },
  { key: "explorer", name: "Construction Explorer", uses: 95 },
];

export default function AdminAnalysis() {
  const navigate = useNavigate();

  function optimise(moduleKey) {
    // TODO: get backend POST /api/admin/optimise { module: moduleKey }
    alert(`Optimisation for ${moduleKey} triggered`);
  }

  return (
    <div className="admin-analysis">
      {/* title（与 AdminMenu / Import 一致） */}
      <div className="admin-hero">
        <h1 className="admin-hero-title">Construct AI Skills Analyser</h1>
        <div className="admin-hero-subtitle">
          Administrator Console — Using Frequency Analysis
        </div>
      </div>

      {/* card 1/4 */}
      <div className="admin-analysis-grid">
        {MODULES.map((m) => (
          <div key={m.key} className="admin-analysis-card">
            <div className="admin-analysis-title">{m.name}</div>

            {/* 静态数据：频率次数 / 月 */}
            <div className="admin-analysis-stat">
              <span className="stat-number">{m.uses}</span>
              <span className="stat-unit">/ month</span>
            </div>

            <button className="btn-outline" onClick={() => optimise(m.key)}>
              Optimise
            </button>
          </div>
        ))}
      </div>

      {/* 右下角返回 */}
      <button
        type="button"
        className="admin-fab-back"
        onClick={() => navigate("/admin")}
      >
        ⬅️ Back to menu
      </button>
    </div>
  );
}

