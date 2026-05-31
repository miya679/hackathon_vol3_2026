/**
 * 進捗記録画面のスモークテスト（教材選択で JS エラーが出ないか）
 * 実行: npx --yes playwright@1.49.1 install chromium && node scripts/smoke-progress-page.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";

let pageErrors = [];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("pageerror", (err) => {
  pageErrors.push(err.message);
});

try {
  await page.goto(`${BASE}/progress/record`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const overlay = page.locator("text=Uncaught runtime errors");
  const hasOverlay = (await overlay.count()) > 0;

  const select = page.locator("#text");
  const optionCount = await select.locator("option").count();

  if (optionCount > 1) {
    await select.selectOption({ index: 1 });
    await page.waitForTimeout(1500);
  } else {
    console.log("SKIP: texts が無いため教材選択をスキップ");
  }

  const hasOverlayAfter = (await overlay.count()) > 0;

  console.log("URL:", page.url());
  console.log("教材 option 数:", optionCount);
  console.log("pageerror:", pageErrors.length ? pageErrors : "(なし)");
  console.log("エラーオーバーレイ(選択前):", hasOverlay);
  console.log("エラーオーバーレイ(選択後):", hasOverlayAfter);

  if (pageErrors.length || hasOverlayAfter) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
