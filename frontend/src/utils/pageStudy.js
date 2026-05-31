/**
 * Firestore の progresses 1件から学習ページ範囲を取得
 * @param {Record<string, unknown>} p
 * @returns {{ start: number, end: number } | null}
 */
export function getProgressRecordRange(p) {
  const ps = Number(p.page_start);
  const pe = Number(p.page_end);
  if (Number.isFinite(ps) && Number.isFinite(pe) && ps >= 1 && pe >= 1) {
    const a = Math.floor(Math.min(ps, pe));
    const b = Math.floor(Math.max(ps, pe));
    return { start: a, end: b };
  }
  return null;
}

/**
 * 教材 texts のページ全体（Firestore: start_page, end_page）
 * @param {Record<string, unknown>} text
 * @returns {{ start: number, end: number } | null}
 */
export function getTextPageBounds(text) {
  const s = Number(text?.start_page);
  const e = Number(text?.end_page);
  if (
    Number.isInteger(s) &&
    Number.isInteger(e) &&
    s >= 1 &&
    e >= s
  ) {
    return { start: s, end: e };
  }
  return null;
}

/**
 * 教材のページ全体の範囲（ヒートマップの横軸）
 * @param {Record<string, unknown>} text
 * @param {Array<Record<string, unknown>>} progressesForText
 */
export function getEffectiveTextBounds(text, progressesForText) {
  const fromDoc = getTextPageBounds(text);
  if (fromDoc) return fromDoc;

  let maxEnd = 1;
  for (const p of progressesForText) {
    const r = getProgressRecordRange(p);
    if (r) maxEnd = Math.max(maxEnd, r.end);
  }
  return { start: 1, end: Math.max(maxEnd, 20) };
}

/**
 * バケットごとの学習記録回数（範囲がバケットと重なるたび +1）
 * @param {{ start: number, end: number }} bounds
 * @param {Array<Record<string, unknown>>} progressesForText
 * @param {number} bucketSize
 */
export function buildHeatmapBuckets(bounds, progressesForText, bucketSize = 5) {
  const { start, end } = bounds;
  if (end < start) return [];

  const n = Math.ceil((end - start + 1) / bucketSize);
  const counts = Array(n).fill(0);

  for (const p of progressesForText) {
    const r = getProgressRecordRange(p);
    if (!r) continue;

    for (let i = 0; i < n; i++) {
      const bStart = start + i * bucketSize;
      const bEnd = Math.min(end, start + (i + 1) * bucketSize - 1);
      const overlap = !(r.end < bStart || r.start > bEnd);
      if (overlap) counts[i] += 1;
    }
  }

  return counts.map((count, i) => ({
    pageStart: start + i * bucketSize,
    pageEnd: Math.min(end, start + (i + 1) * bucketSize - 1),
    count,
  }));
}

/**
 * ラベル入力（カンマ・読点・空白区切り、先頭の # は除去）
 * @param {string} raw
 * @returns {string[]}
 */
export function parseLabelInput(raw) {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,、\s]+/)
    .map((s) => s.trim().replace(/^#+/u, ""))
    .filter(Boolean)
    .slice(0, 20);
}
