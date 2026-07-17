import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("export UI downloads generated PDF assets directly", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");

  assert.match(shell, /cvPdfExports\.modern\.href/);
  assert.match(shell, /cvPdfExports\.modern\.fileName/);
  assert.match(shell, /cvPdfExports\.ats\.href/);
  assert.match(shell, /cvPdfExports\.ats\.fileName/);
  assert.match(shell, /\bdownload=/);

  assert.doesNotMatch(shell, /printCurrentPage/);
  assert.doesNotMatch(shell, /downloadCvSpreadsheet/);
  assert.doesNotMatch(shell, /buildCvSpreadsheetXml/);
  assert.doesNotMatch(shell, /\.xls\b/i);
});

test("export action helper was removed with browser print behavior", async () => {
  const helperExists = await import("node:fs/promises")
    .then((fs) => fs.stat(new URL("../src/utils/exportActions.ts", import.meta.url)))
    .then(() => true, () => false);

  assert.equal(helperExists, false);
});

test("app icon exists and contains the stylized P mark", async () => {
  const icon = await readFile(new URL("../app/icon.svg", import.meta.url), "utf8");

  assert.match(icon, /^<svg\b/);
  assert.match(icon, /<title>Patricio Montes portfolio icon<\/title>/);
  assert.match(icon, /id="mark"/);
  assert.match(icon, /d="M158 386V126h126/);
});
