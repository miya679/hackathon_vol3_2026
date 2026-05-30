/**
 * text_range（例: "1-300", "1〜50"）を開始・終了ページに分解する
 * @param {string} textRange
 * @returns {{ start: number, end: number } | null}
 */
export function parseTextRange(textRange) {
  if (!textRange?.trim()) return null;
  const match = textRange.trim().match(/^(\d+)\s*[-〜~－]\s*(\d+)$/u);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    return null;
  }
  return { start, end };
}

/**
 * @param {number} page
 * @param {{ start: number, end: number } | null} range
 */
export function validateProgressPage(page, range) {
  if (!Number.isInteger(page) || page < 1) {
    return "ページ番号は 1 以上の整数で入力してください";
  }
  if (!range) return null;
  if (page < range.start || page > range.end) {
    return `ページは ${range.start}〜${range.end} の範囲で入力してください`;
  }
  return null;
}

/**
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
