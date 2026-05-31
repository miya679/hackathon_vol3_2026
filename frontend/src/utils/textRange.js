/**
 * 単一ページの到達％（教材に start_page/end_page がある場合）
 * @param {number} page
 * @param {{ start: number, end: number } | null} range
 * @returns {number | null} 0〜100 の進捗％（参考表示用）
 */
export function progressPercent(page, range) {
  if (!range || range.end <= range.start) return null;
  const pct = Math.round(
    ((page - range.start) / (range.end - range.start)) * 100
  );
  return Math.min(100, Math.max(0, pct));
}

/**
 * 学習範囲 [pageStart, pageEnd] の検証
 * @param {number} pageStart
 * @param {number} pageEnd
 * @param {{ start: number, end: number } | null} bounds
 * @returns {string | null}
 */
export function validatePageRange(pageStart, pageEnd, bounds) {
  if (!Number.isInteger(pageStart) || !Number.isInteger(pageEnd)) {
    return "開始・終了ページは整数で指定してください";
  }
  if (pageStart < 1 || pageEnd < 1) {
    return "ページは 1 以上の整数で入力してください";
  }
  if (pageStart > pageEnd) {
    return "開始ページは終了ページ以下にしてください";
  }
  if (!bounds) return null;
  if (pageStart < bounds.start || pageEnd > bounds.end) {
    return `ページは ${bounds.start}〜${bounds.end} の範囲で入力してください`;
  }
  return null;
}
