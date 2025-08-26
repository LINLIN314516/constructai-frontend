import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Explorer from "./pages/Explorer.jsx";
import Heatmap from "./pages/Heatmap.jsx";
import Trends from "./pages/Trends.jsx";
import ExportPage from "./pages/Export.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminImport from "./pages/admin/AdminImport.jsx";
import AdminVersion from "./pages/admin/AdminVersion.jsx";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "explorer", element: <Explorer /> },
      { path: "heatmap", element: <Heatmap /> },
      { path: "trends", element: <Trends /> },
      { path: "export", element: <ExportPage /> },
      {
        path: "admin",
        children: [
          { path: "login", element: <AdminLogin /> },
          { path: "import", element: <AdminImport /> },
          { path: "version", element: <AdminVersion /> },
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

