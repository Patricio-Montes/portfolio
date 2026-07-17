import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("export UI downloads generated PDF assets directly", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");

  assert.match(shell, /getCvPdfExports\(language\)/);
  assert.match(shell, /<details\b/);
  assert.match(shell, /<summary\b/);
  assert.match(shell, /cvExports\.modern\.href/);
  assert.match(shell, /cvExports\.modern\.fileName/);
  assert.match(shell, /cvExports\.ats\.href/);
  assert.match(shell, /cvExports\.ats\.fileName/);
  assert.match(shell, /\bdownload=/);

  assert.doesNotMatch(shell, /printCurrentPage/);
  assert.doesNotMatch(shell, /downloadCvSpreadsheet/);
  assert.doesNotMatch(shell, /buildCvSpreadsheetXml/);
  assert.doesNotMatch(shell, /\.xls\b/i);
});

test("theme selection is a single toggle control instead of mapped theme buttons", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(shell, /content\.themes\.map/);
  assert.match(shell, /setTheme\(/);
  assert.match(shell, /theme === "midnight" \? "graphite" : "midnight"|theme === 'midnight' \? 'graphite' : 'midnight'/);
});

test("download UI is one details-summary control with Modern and ATS subitems", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");
  const exportActionsMatch = shell.match(/function ExportActions[\s\S]*?\n}\n\nfunction About/);

  assert.ok(exportActionsMatch, "ExportActions component should be present");
  const exportActionsSource = exportActionsMatch[0];

  assert.match(exportActionsSource, /<details\b/);
  assert.match(exportActionsSource, /<summary\b/);
  assert.equal((exportActionsSource.match(/<summary\b/g) ?? []).length, 1);
  assert.equal((exportActionsSource.match(/<a\b/g) ?? []).length, 2);
  assert.match(exportActionsSource, /copy\.modernPdfLabel/);
  assert.match(exportActionsSource, /copy\.atsPdfLabel/);
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
