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
import AdminMenu from "./pages/admin/AdminMenu.jsx";        // 你同学没有的，保留你的
import AdminAnalysis from "./pages/admin/AdminAnalysis.jsx"; // 你同学没有的，保留你的（Frequency）
import AdminImport from "./pages/admin/AdminImport.jsx";
import AdminVersion from "./pages/admin/AdminVersion.jsx";

// --- Explorer pages ---（保留你的分页面结构）
// 若你同学只有一个 Explorer.jsx，请把他的内容迁到下面几个分页面里
import Explorer from "./pages/Explorer/Explorer.jsx";
import ExplorerSkill from "./pages/Explorer/ExplorerSkill.jsx";
import ExplorerRegion from "./pages/Explorer/ExplorerRegion.jsx";
import ExplorerRole from "./pages/Explorer/ExplorerRole.jsx";
import ExplorerVisualisation from "./pages/Explorer/ExplorerVisualisation.jsx";

// --- Others ---
import Heatmap from "./pages/Heatmap.jsx";
import Trends from "./pages/Trends.jsx";
import TrendsExport from "./pages/TrendsExport.jsx"; // 你有的导出页
import ExportPage from "./pages/Export.jsx";

import "./index.css";

// ------- 简单守卫：无 token 则跳去 /login -------
function requireAdminToken(element) {
  const token = localStorage.getItem("admin_token");
  return token ? element : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // 首页
      { index: true, element: <Dashboard /> },

      // Explorer（统一用你的分路由；你同学的单页 Explorer.jsx 可作为 /explorer 的默认页）
      { path: "explorer", element: <Explorer /> },
      { path: "explorer/skill/:id", element: <ExplorerSkill /> },
      { path: "explorer/region/:id", element: <ExplorerRegion /> },
      { path: "explorer/role/:id", element: <ExplorerRole /> },
      { path: "explorer/visualisation/:type/:id", element: <ExplorerVisualisation /> },

      // 其他用户页
      { path: "heatmap", element: <Heatmap /> },
      { path: "trends", element: <Trends /> },
      { path: "export", element: <ExportPage /> },
      { path: "export-trends", element: <TrendsExport /> },

      // Admin 登录（不受守卫）
      { path: "login", element: <AdminLogin /> },

      // 兼容你同学的 /admin/login（两种都能进登录）
      { path: "admin/login", element: <Navigate to="/login" replace /> },

      // Admin 受守卫区域
      {
        path: "admin",
        element: <Outlet />,
        children: [
          { index: true, element: requireAdminToken(<AdminMenu />) },        // 管理员首页（菜单）
          { path: "analysis", element: requireAdminToken(<AdminAnalysis />) },// 频次分析
          { path: "import", element: requireAdminToken(<AdminImport />) },    // 数据导入
          { path: "version", element: requireAdminToken(<AdminVersion />) },  // 版本管理
        ],
      },
    ],
  },

  // 404（可选）
  { path: "*", element: <Navigate to="/" replace /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
