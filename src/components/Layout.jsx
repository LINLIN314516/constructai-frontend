import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const menu = [
    { to: "/", label: "Dashboard" },
    { to: "/explorer", label: "Explorer" },
    { to: "/heatmap", label: "Heatmap" },
    { to: "/trends", label: "Trends" },
    { to: "/export", label: "Export" },
    { to: "/admin/login", label: "Admin" },
  ];

  return (
    <div style={{display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"100vh"}}>
      <aside style={{borderRight:"1px solid #eee", padding:"16px"}}>
        <h3>ConstructAI</h3>
        <nav style={{display:"grid", gap:"8px", marginTop:"12px"}}>
          {menu.map(m => <Link key={m.to} to={m.to}>{m.label}</Link>)}
        </nav>
      </aside>
      <main style={{padding:"24px"}}>
        <Outlet />
      </main>
    </div>
  );
}
