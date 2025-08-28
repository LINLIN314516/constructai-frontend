import { useEffect, useState } from "react";
import { fetchInsights } from "../services/jobInsightsApi";
import { parseSingleSkillTrend } from "../adapters/skillParsers";

export function useSkillTrend({ skill, region, from, to }) {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [data,    setData]    = useState(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true); setError(null);
        const raw = await fetchInsights({ skill, region, from, to });
        const parsed = parseSingleSkillTrend(raw);
        if (!aborted) setData(parsed);
      } catch (e) {
        if (!aborted) setError(e?.message || "Failed to fetch");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [skill, region, from, to]);

  return { loading, error, data };
}
