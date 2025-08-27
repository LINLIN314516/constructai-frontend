import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = Boolean(localStorage.getItem("admin_token"));
  const adminName = localStorage.getItem("admin_name") || "admin";
  const onAdminRoute = location.pathname.startsWith("/admin");

  // --- 用户区菜单（未登录或在用户区时显示）---
  const userMenu = [
    { to: "/", label: "Dashboard", exact: true },
    { to: "/heatmap", label: "Heatmap" },
    { to: "/export", label: "Regional Insights" },
    { to: "/trends", label: "Demand Trends" },
    { to: "/explorer", label: "Construction Explorer", groupStartsWith: "/explorer" },
  ];

  // --- Admin 区菜单（仅登录后展示）---
  const adminMenu = [
    { to: "/admin", label: "Admin Home", exactIndex: true, groupStartsWith: "/admin" },
    { to: "/admin/import", label: "Data Importing" },
    { to: "/admin/analysis", label: "Frequency Analysis" },
    { to: "/admin/version", label: "Version Management" },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    if (item.exactIndex && (location.pathname === "/admin" || location.pathname === "/admin/"))
      return true;
    if (item.groupStartsWith) return location.pathname.startsWith(item.groupStartsWith);
    return location.pathname === item.to;
  };

  const onLogout = () => {
    localStorage.removeItem("admin_token");
    // localStorage.removeItem("admin_name");
    navigate("/login", { replace: true });
  };

  // ---------- 侧边栏内容：根据“是否已登录 + 是否在 admin 区域”切换 ----------
  let sidebarContent = null;

  if (isAdmin && onAdminRoute) {
    // ✅ 登录 + 位于 Admin：只显示“User / Admin”两项（你的预期样式）
    sidebarContent = (
      <nav className="sidebar-nav">
        <div className="nav-group-title">User</div>
        <Link
          to="/"
          className={"nav-item" + (!onAdminRoute ? " nav-item-active" : "")}
        >
          <span className="nav-bullet" aria-hidden>•</span>
          <span className="nav-label">User</span>
        </Link>

        <div className="nav-group-title" style={{ marginTop: 12 }}>Admin</div>
        <Link
          to="/admin"
          className={"nav-item" + (onAdminRoute ? " nav-item-active" : "")}
        >
          <span className="nav-bullet" aria-hidden>•</span>
          <span className="nav-label">Admin</span>
        </Link>
      </nav>
    );
  } else {
    // 未登录，或已登录但在用户区：显示完整功能列表 + Admin 区块
    sidebarContent = (
      <nav className="sidebar-nav">
        <div className="nav-group-title">User</div>
        {userMenu.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className={"nav-item" + (isActive(m) ? " nav-item-active" : "")}
          >
            <span className="nav-bullet" aria-hidden>•</span>
            <span className="nav-label">{m.label}</span>
          </Link>
        ))}

        <div className="nav-group-title" style={{ marginTop: 12 }}>Admin</div>
        {!isAdmin ? (
          <>
            {/* 兼容你同学的 /admin/login 链接 */}
            <Link
              to="/login"
              className={"nav-item" + (location.pathname === "/login" ? " nav-item-active" : "")}
            >
              <span className="nav-bullet" aria-hidden>•</span>
              <span className="nav-label">Admin Login</span>
            </Link>
          </>
        ) : (
          adminMenu.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={"nav-item" + (isActive(m) ? " nav-item-active" : "")}
            >
              <span className="nav-bullet" aria-hidden>•</span>
              <span className="nav-label">{m.label}</span>
            </Link>
          ))
        )}
      </nav>
    );
  }

  return (
    <div className="app-layout">
      {/* 左侧侧边栏 */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon" aria-hidden>🏛️</div>
          <div className="brand-text">
            <div>Construct AI</div>
            <div className="brand-sub">Skills Analyser</div>
          </div>
        </div>

        {sidebarContent}

        <div className="sidebar-footer">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>⬅️ Back</button>
        </div>
      </aside>

      {/* 右侧主区 + 顶部条 */}
      <main className="app-main">
        <div className="topbar">
          <div className="topbar-left" />
          <div className="topbar-right">
            {isAdmin ? (
              <>
                <span className="topbar-user">Hi, {adminName}!</span>
                <button className="topbar-logout" onClick={onLogout}>Log out</button>
              </>
            ) : (
              <Link to="/login" className="topbar-login-link">Admin Login</Link>
            )}
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}

