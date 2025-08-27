// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// --- Admin pages ---
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminMenu from "./pages/admin/AdminMenu.jsx";
import AdminAnalysis from "./pages/admin/AdminAnalysis.jsx";
import AdminImport from "./pages/admin/AdminImport.jsx";
import AdminVersion from "./pages/admin/AdminVersion.jsx";

// --- Explorer pages ---
import Explorer from "./pages/Explorer/Explorer.jsx";
import ExplorerSkill from "./pages/Explorer/ExplorerSkill.jsx";
import ExplorerRegion from "./pages/Explorer/ExplorerRegion.jsx";
import ExplorerRole from "./pages/Explorer/ExplorerRole.jsx";
import ExplorerVisualisation from "./pages/Explorer/ExplorerVisualisation.jsx";

// --- Others ---
import Heatmap from "./pages/Heatmap.jsx";
import Trends from "./pages/Trends.jsx";
import TrendsExport from "./pages/TrendsExport.jsx";
import ExportPage from "./pages/Export.jsx";

import "./index.css";

/** 渲染期守卫：无 token 则跳去 /login（不要在路由表里“调用函数返回 Navigate”） */
function RequireAdmin({ children }) {
  const token = localStorage.getItem("admin_token");
  return token ? children : <Navigate to="/login" replace />;
}

/** 登录页 Gate：已登录访问 /login 时，直接带去 /admin */
function LoginGate() {
  const token = localStorage.getItem("admin_token");
  return token ? <Navigate to="/admin" replace /> : <AdminLogin />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // 首页
      { index: true, element: <Dashboard /> },

      // Explorer（含子页）
      { path: "explorer", element: <Explorer /> },
      { path: "explorer/skill/:id", element: <ExplorerSkill /> },
      { path: "explorer/region/:id", element: <ExplorerRegion /> },
      { path: "explorer/role/:id", element: <ExplorerRole /> },
      { path: "explorer/visualisation/:type/:id", element: <ExplorerVisualisation /> },

      // 其它功能页
      { path: "heatmap", element: <Heatmap /> },
      { path: "trends", element: <Trends /> },
      { path: "export", element: <ExportPage /> },
      { path: "export-trends", element: <TrendsExport /> },

      // 登录页（用 Gate 防止已登录还停在 /login）
       // 登录
       { path: "login", element: <LoginGate /> },
       { path: "admin/login", element: <Navigate to="/login" replace /> },

      // ✅ 兼容旧链接（侧边栏/书签可能还指向这些老地址）
      { path: "admin-home", element: <Navigate to="/admin" replace /> },
      { path: "data-importing", element: <Navigate to="/admin/import" replace /> },
      { path: "frequency-analysis", element: <Navigate to="/admin/analysis" replace /> },
      { path: "version-management", element: <Navigate to="/admin/version" replace /> },
      // （regional-insights 已显式配置在上面，无需重定向）

      // Admin（受守卫）
      {
        path: "admin",
        element: <Outlet />,
        children: [
          { index: true, element: <RequireAdmin><AdminMenu /></RequireAdmin> },
          { path: "import", element: <RequireAdmin><AdminImport /></RequireAdmin> },
          { path: "analysis", element: <RequireAdmin><AdminAnalysis /></RequireAdmin> },
          { path: "version", element: <RequireAdmin><AdminVersion /></RequireAdmin> },
        ],
      },
    ],
  },

  // 404（可选）：落回首页
  // { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

