import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeatmap from "../components/PageHeatmap";
import { fetchTexts } from "../services/textService";
import { fetchProgresses } from "../services/progressService";
import {
  getEffectiveTextBounds,
  getProgressRecordRange,
  getTextPageBounds,
} from "../utils/pageStudy";
import { progressPercent } from "../utils/textRange";

function toMillis(value) {
  if (value?.toMillis) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return null;
}

function formatLabels(labels) {
  if (!Array.isArray(labels) || labels.length === 0) return null;
  return labels.slice(0, 5).join(" · ");
}

function ProgressDisplayPage() {
  const [texts, setTexts] = useState([]);
  const [textsLoading, setTextsLoading] = useState(true);
  const [textsError, setTextsError] = useState(null);

  const [progresses, setProgresses] = useState([]);
  const [progressesLoading, setProgressesLoading] = useState(true);
  const [progressesError, setProgressesError] = useState(null);

  const load = useCallback(async () => {
    setTextsLoading(true);
    setTextsError(null);
    setProgressesLoading(true);
    setProgressesError(null);

    try {
      const [textsList, progressesList] = await Promise.all([
        fetchTexts(),
        fetchProgresses(),
      ]);
      setTexts(textsList);
      setProgresses(progressesList);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "進捗データの取得に失敗しました";
      setTextsError(msg);
      setProgressesError(msg);
    } finally {
      setTextsLoading(false);
      setProgressesLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const progressesByTextId = useMemo(() => {
    const m = new Map();
    for (const p of progresses) {
      const tid = p.text_id;
      if (!tid) continue;
      if (!m.has(tid)) m.set(tid, []);
      m.get(tid).push(p);
    }
    return m;
  }, [progresses]);

  const latestByText = useMemo(() => {
    const sorted = [...progresses].sort((a, b) => {
      const aMs = toMillis(a.updated_at) ?? 0;
      const bMs = toMillis(b.updated_at) ?? 0;
      return bMs - aMs;
    });

    const map = new Map();
    for (const p of sorted) {
      const textId = p.text_id;
      if (!textId || map.has(textId)) continue;
      map.set(textId, p);
    }
    return map;
  }, [progresses]);

  const rows = useMemo(() => {
    return texts
      .filter((t) => progressesByTextId.has(t.id))
      .map((t) => {
        const list = progressesByTextId.get(t.id) ?? [];
        const p = latestByText.get(t.id);
        const recordRange = p ? getProgressRecordRange(p) : null;
        const bounds = getEffectiveTextBounds(t, list);
        const bookRange = getTextPageBounds(t);

        const endPage = recordRange?.end ?? 0;
        const pct =
          bookRange && endPage > 0
            ? progressPercent(endPage, bookRange)
            : null;

        return {
          text: t,
          progressesForText: list,
          bounds,
          latest: p,
          recordRange,
          pct,
        };
      });
  }, [texts, progressesByTextId, latestByText]);

  const loading = textsLoading || progressesLoading;
  const error = textsError || progressesError;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">進捗表示</h1>
        <p className="page-description">
          教材ごとの学習密度マップ（ヒートマップ）と最新の記録です。
        </p>
      </header>

      {error && (
        <div className="alert alert--error" role="alert">
          {error}
          <button type="button" className="btn btn--text" onClick={load}>
            再読み込み
          </button>
        </div>
      )}

      <section className="card">
        {loading && <p>進捗を読み込み中...</p>}

        {!loading && texts.length === 0 && (
          <p>教材（texts）がありません。Firestore に texts を追加してください。</p>
        )}

        {!loading && texts.length > 0 && rows.length === 0 && (
          <p>まだ進捗が記録されていません。</p>
        )}

        {!loading && rows.length > 0 && (
          <div className="progress-display-cards">
            {rows.map((row) => (
              <div key={row.text.id} className="progress-display-card">
                <div className="progress-display-card__title">
                  {row.text.text_name}
                </div>
                {row.recordRange && (
                  <div className="progress-display-card__meta">
                    最新の記録: p.{row.recordRange.start}
                    {row.recordRange.start !== row.recordRange.end
                      ? `〜${row.recordRange.end}`
                      : ""}
                    {row.pct !== null ? `（到達目安 ${row.pct}%）` : ""}
                  </div>
                )}
                {row.latest && formatLabels(row.latest.labels) && (
                  <div className="progress-display-card__labels">
                    ラベル: {formatLabels(row.latest.labels)}
                  </div>
                )}
                <PageHeatmap
                  bounds={row.bounds}
                  progressesForText={row.progressesForText}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProgressDisplayPage;
