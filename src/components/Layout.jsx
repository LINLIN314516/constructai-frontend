import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const menu = [
    { to: "/", label: "Dashboard" },
    { to: "/heatmap", label: "Heatmap" },
    { to: "/export", label: "Regional Insights" },
    { to: "/trends", label: "Demand Trends" },
    { to: "/explorer", label: "Construction Explorer" },
    { to: "/admin/login", label: "Admin" },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" aria-hidden>🏛️</div>
          <div className="brand-text">
            <div>Construct AI</div>
            <div className="brand-sub">Skills Analyser</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menu.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={
                "nav-item" + (location.pathname === m.to ? " nav-item-active" : "")
              }
            >
              <span className="nav-bullet" aria-hidden>•</span>
              <span className="nav-label">{m.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button type="button" className="back-btn">⬅️ Back</button>
        </div>
      </aside>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
