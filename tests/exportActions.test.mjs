import assert from "node:assert/strict";
import test from "node:test";
import { printCurrentPage } from "../src/utils/exportActions.ts";

test("PDF export delegates to the browser print dialog", () => {
  let printCalls = 0;

  printCurrentPage({
    print() {
      printCalls += 1;
    }
  });

  assert.equal(printCalls, 1);
});

test("app icon exists and contains the stylized P mark", async () => {
  const icon = await import("node:fs/promises").then((fs) =>
    fs.readFile(new URL("../app/icon.svg", import.meta.url), "utf8")
  );

  assert.match(icon, /^<svg\b/);
  assert.match(icon, /<title>Patricio Montes portfolio icon<\/title>/);
  assert.match(icon, /id="mark"/);
  assert.match(icon, /d="M158 386V126h126/);
});
