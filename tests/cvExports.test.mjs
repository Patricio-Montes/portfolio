import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { cvPdfExports, cvPdfExportLanguages, cvPdfVariants, getCvPdfExports } from "../src/utils/cvExports.ts";

test("CV exports expose downloadable Modern and ATS PDF assets", async () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  assert.deepEqual([...cvPdfVariants], ["modern", "ats"]);

  assert.deepEqual(getCvPdfExports("en").modern, {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern-en.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-modern-en.pdf`
  });
  assert.deepEqual(getCvPdfExports("en").ats, {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats-en.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-ats-en.pdf`
  });

  for (const variant of cvPdfVariants) {
    const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports("en")[variant].fileName}`, import.meta.url));

    assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
    assert.match(pdf.toString("latin1"), /%%EOF\s*$/);
    assert.ok(pdf.byteLength > 1_000, `${variant} PDF should contain generated CV content`);
  }
});

test("CV exports do not use legacy unsuffixed English PDF assets", () => {
  for (const variant of cvPdfVariants) {
    const exportItem = getCvPdfExports("en")[variant];

    assert.match(exportItem.fileName, /-en\.pdf$/);
    assert.match(exportItem.href, /-en\.pdf$/);
    assert.notEqual(exportItem.fileName, `patricio-montes-cv-${variant}.pdf`);
    assert.doesNotMatch(exportItem.href, new RegExp(`/downloads/patricio-montes-cv-${variant}\\.pdf$`));
  }
});

test("CV exports resolve localized downloadable assets by active language", async () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  assert.deepEqual([...cvPdfExportLanguages], ["en", "es", "pt"]);

  assert.deepEqual(getCvPdfExports("en"), cvPdfExports.en);
  assert.deepEqual(getCvPdfExports("es").modern, {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern-es.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-modern-es.pdf`
  });
  assert.deepEqual(getCvPdfExports("es").ats, {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats-es.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-ats-es.pdf`
  });
  assert.deepEqual(getCvPdfExports("pt").modern, {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern-pt.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-modern-pt.pdf`
  });
  assert.deepEqual(getCvPdfExports("pt").ats, {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats-pt.pdf",
    href: `${basePath}/downloads/patricio-montes-cv-ats-pt.pdf`
  });

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));

      assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
      assert.match(pdf.toString("latin1"), /%%EOF\s*$/);
      assert.ok(pdf.byteLength > 1_000, `${language} ${variant} PDF should contain generated CV content`);
    }
  }
});

test("generated PDF assets keep public contact privacy constraints", async () => {
  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdfText = (
        await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url))
      ).toString("latin1");

      assert.doesNotMatch(pdfText, /\bPhone\b/i);
      assert.doesNotMatch(pdfText, /\+54\s+9\s+11/i);
      assert.doesNotMatch(pdfText, /4051\s+8040/);
    }
  }
});
