import { Link } from "react-router-dom";

// —— 内联黑色图标，避免装依赖 ——
function AnchorIcon() {
  return (
    <svg viewBox="0 0 24 24" width="88" height="88" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v9" />
      <path d="M5 12c0 4 3.5 7 7 7s7-3 7-7" />
    </svg>
  );
}
function ApertureIcon() {
  return (
    <svg viewBox="0 0 24 24" width="88" height="88" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
    </svg>
  );
}
function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" width="88" height="88" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="4" rx="1" />
      <path d="M7 7v14h10V7" />
      <path d="M10 12h4" />
    </svg>
  );
}

function Card({ to, title, Icon }) {
  return (
    <Link to={to} className="admin-card">
      <div className="admin-card-title">{title}</div>
      <Icon />
    </Link>
  );
}

export default function AdminMenu() {
  return (
    <div className="admin-menu">
      {/* 居中标题区 */}
      <div className="admin-hero">
        <h1 className="admin-hero-title">Construct AI Skills Analyser</h1>
        <div className="admin-hero-subtitle">Administrator Console — Select the Function</div>
      </div>

      {/* 中间三张卡片，一排居中 */}
      <div className="admin-cards">
        <Card to="/admin/import"  title="Data Importing"      Icon={AnchorIcon}   />
        <Card to="/admin/analysis" title="Frequency Analysis" Icon={ApertureIcon} />
        <Card to="/admin/version"  title="Version Management" Icon={ArchiveIcon}  />
      </div>
    </div>
  );
}


