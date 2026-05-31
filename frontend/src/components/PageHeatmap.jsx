import { buildHeatmapBuckets } from "../utils/pageStudy";

function countToClass(count) {
  if (count <= 0) return "heatmap-cell--0";
  if (count === 1) return "heatmap-cell--1";
  if (count <= 3) return "heatmap-cell--2";
  if (count <= 5) return "heatmap-cell--3";
  return "heatmap-cell--4";
}

/**
 * @param {{
 *   bounds: { start: number, end: number };
 *   progressesForText: Array<Record<string, unknown>>;
 *   bucketSize?: number;
 * }} props
 */
function PageHeatmap({ bounds, progressesForText, bucketSize = 5 }) {
  const buckets = buildHeatmapBuckets(
    bounds,
    progressesForText,
    bucketSize
  );

  if (buckets.length === 0) {
    return <p className="form-hint">ヒートマップを表示するデータがありません。</p>;
  }

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-legend" aria-hidden>
        <span>薄いほど記録なし〜濃いほど触れた回数が多い</span>
      </div>
      <div
        className="heatmap-grid"
        role="grid"
        aria-label="ページ単位の学習記録回数ヒートマップ"
      >
        {buckets.map((b) => (
          <div
            key={`${b.pageStart}-${b.pageEnd}`}
            role="gridcell"
            className={`heatmap-cell ${countToClass(b.count)}`}
            title={`p.${b.pageStart}〜${b.pageEnd}：記録が重なった回数 ${b.count}（${bucketSize}ページ単位）`}
          />
        ))}
      </div>
      <p className="form-hint heatmap-hint">
        各マスは最大 {bucketSize} ページ分をまとめ、範囲が重なる記録があるたびに濃くなります。
      </p>
    </div>
  );
}

export default PageHeatmap;
