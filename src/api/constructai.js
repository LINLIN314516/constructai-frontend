import { apiGet, apiPost } from "./client";

// Demand Trends
export function getDemandTrends() {
  return apiGet("/trends", "/mock/demand_trends.json");
}

// Construction Explorer
export function getConstructionExplorer() {
  return apiGet("/explorer", "/mock/construction_explorer.json");
}

// Admin - Versions
export function getAdminVersions() {
  return apiGet("/admin/versions", "/mock/admin_data.json");
}
export function restoreVersion(versionId) {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    return Promise.resolve({ success:true, message:`${versionId} restored successfully` });
  }
  return apiPost(`/admin/restore/${versionId}`, {});
}

