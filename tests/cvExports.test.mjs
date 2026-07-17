import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { cvPdfExports, cvPdfVariants } from "../src/utils/cvExports.ts";

test("CV exports expose downloadable Modern and ATS PDF assets", async () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  assert.deepEqual([...cvPdfVariants], ["modern", "ats"]);

  assert.deepEqual(cvPdfExports.modern, {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-modern.pdf`
  });
  assert.deepEqual(cvPdfExports.ats, {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-ats.pdf`
  });

  for (const variant of cvPdfVariants) {
    const pdf = await readFile(new URL(`../public/downloads/${cvPdfExports[variant].fileName}`, import.meta.url));

    assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.match(pdf.toString("latin1"), /%%EOF\s*$/);
    assert.ok(pdf.byteLength > 1_000, `${variant} PDF should contain generated CV content`);
  }
});

test("generated PDF assets keep public contact privacy constraints", async () => {
  for (const variant of cvPdfVariants) {
    const pdfText = (
      await readFile(new URL(`../public/downloads/${cvPdfExports[variant].fileName}`, import.meta.url))
    ).toString("latin1");

    assert.doesNotMatch(pdfText, /\bPhone\b/i);
    assert.doesNotMatch(pdfText, /\+54\s+9\s+11/i);
    assert.doesNotMatch(pdfText, /4051\s+8040/);
  }
});
