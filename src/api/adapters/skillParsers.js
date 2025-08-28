const num = x => (Number.isFinite(Number(x)) ? Number(x) : 0);

/** 解析单技能 TREND（任意 region，可带 from/to）
 * 输入示例：
 * [{ PK:"TREND#REGION#VIC#SKILL#NLP", SK:"DATE#2025-05-01", count:460 }, ...]
 */
export function parseSingleSkillTrend(rows) {
  const pts = [];
  for (const r of rows || []) {
    if (!r?.PK?.startsWith?.("TREND#")) continue;
    const parts = r.PK.split("#");
    const skill = parts[4];                       // NLP / Computer Vision / ...
    const date  = (r.SK || "").replace("DATE#", "");
    if (!skill || !date) continue;
    pts.push({ date, count: num(r.count), skill });
  }
  pts.sort((a,b)=>a.date.localeCompare(b.date));

  const first = pts[0]?.count ?? 0;
  const last  = pts[pts.length - 1]?.count ?? 0;
  const growth = first > 0 ? (last - first) / first : 0;

  return {
    points: pts,                  // [{date,count,skill}]
    lastCount: last,              // 用于“Job posts”
    growthRate: growth,           // 先用首尾增长率近似
    skill: pts[0]?.skill || null,
  };
}
