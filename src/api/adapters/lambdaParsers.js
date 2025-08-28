const num = x => (Number.isFinite(Number(x)) ? Number(x) : 0);

export function parseTrend(rows) {
  const byDate = new Map();
  for (const r of rows || []) {
    if (!r?.PK?.startsWith?.("TREND#")) continue;
    const skill = r.PK.split("#")[4];
    const date = (r.SK || "").replace("DATE#", "");
    const key = ["NLP", "Computer Vision", "MLOps"].includes(skill) ? skill : null;

    if (!date || !key) continue;
    const rec = byDate.get(date) || { label: date, NLP: 0, "Computer Vision": 0, MLOps: 0 };
    rec[key] += num(r.count);
    byDate.set(date, rec);
  }
  return [...byDate.values()].sort((a,b)=>a.label.localeCompare(b.label));
}

export function parseRank(rows) {
  const out = [];
  for (const r of rows || []) {
    if (!r?.PK?.startsWith?.("RANK#")) continue;
    const skill = (r.SK || "").split("#")[3];
    out.push({ skill, count: num(r.count) });
  }
  return out.sort((a,b)=>b.count-a.count);
}

export function parseDateTotals(rows) {
  const out = [];
  for (const r of rows || []) {
    if (!r?.PK?.startsWith?.("DATE#")) continue;
    const skill = (r.SK || "").split("#")[3];
    out.push({ skill, count: num(r.count) });
  }
  return out.sort((a,b)=>b.count-a.count);
}
