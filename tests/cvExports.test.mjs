import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent } from "../src/content/portfolio.ts";
import { cvPdfExports, cvPdfExportLanguages, cvPdfVariants, getCvPdfExports } from "../src/utils/cvExports.ts";

function extractPdfText(pdf) {
  return [...pdf.toString("latin1").matchAll(/<([0-9A-Fa-f]+)>/g)]
    .map((match) => Buffer.from(match[1], "hex").toString("latin1"))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

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

  assert.deepEqual([...cvPdfExportLanguages], ["en", "es"]);

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
  assert.equal("pt" in cvPdfExports, false);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));

      assert.equal(pdf.subarray(0, 5).toString("ascii"), "%PDF-");
      assert.match(pdf.toString("latin1"), /%%EOF\s*$/);
      assert.ok(pdf.byteLength > 1_000, `${language} ${variant} PDF should contain generated CV content`);
    }
  }
});

test("CV export assets are EN/ES only with no Portuguese PDFs remaining", async () => {
  const files = (await readdir(new URL("../public/downloads/", import.meta.url))).filter((file) =>
    /^patricio-montes-cv-(modern|ats)-.+\.pdf$/.test(file)
  );

  assert.deepEqual(files.sort(), [
    "patricio-montes-cv-ats-en.pdf",
    "patricio-montes-cv-ats-es.pdf",
    "patricio-montes-cv-modern-en.pdf",
    "patricio-montes-cv-modern-es.pdf"
  ]);
  assert.equal(files.some((file) => /-pt\.pdf$/i.test(file)), false);
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

test("generated PDF summaries mirror the concise page summary", async () => {
  for (const language of languageCodes) {
    const expectedSummary = portfolioContent.locales[language].hero.subtitle;

    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      assert.match(pdfText, new RegExp(expectedSummary.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  }
});

test("generated PDF CVs mirror corrected page data", async () => {
  const genericMaterialFramework = ["Material", "Design"].join(" ");
  const pageText = JSON.stringify(portfolioContent);
  const frameworks = portfolioContent.skills.find((group) => group.name.en === "Frameworks");
  const sideas = portfolioContent.experience.find((item) => item.company === "Sideas");

  assert.deepEqual([...languageCodes], ["en", "es"]);
  assert.deepEqual([...cvPdfExportLanguages], ["en", "es"]);
  assert.ok(frameworks?.items.includes("Angular Material"), "Frameworks must include Angular Material");
  assert.equal(frameworks?.items.includes(genericMaterialFramework), false);
  assert.ok(sideas?.tech.includes("Angular Material"), "Sideas tech must keep Angular Material");
  assert.doesNotMatch(pageText, /\bPortuguese\b|\bPortugués\b|\bPortuguês\b|\bPT\b|\bpt\b/);
  assert.doesNotMatch(pageText, /Whimsical|JSF/);
  assert.match(pageText, /Ionic/);
  assert.match(pageText, /DDD/);
  assert.match(pageText, /Codeicus/);
  assert.match(pageText, /Luxsys S\.R\.L/);
  assert.match(pageText, /ECIC Systems/);

  const files = (await readdir(new URL("../public/downloads/", import.meta.url))).filter((file) =>
    /^patricio-montes-cv-(modern|ats)-.+\.pdf$/.test(file)
  );
  assert.equal(files.some((file) => /-pt\.pdf$/i.test(file)), false);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      assert.doesNotMatch(pdfText, /\bPortuguese\b|\bPortugués\b|\bPortuguês\b|\bPT\b|\bpt\b/);
      assert.doesNotMatch(pdfText, /Whimsical|JSF/);
      assert.doesNotMatch(pdfText, new RegExp(genericMaterialFramework));
      assert.match(pdfText, /Frameworks: [^\n]*Angular Material/);
      assert.match(pdfText, /Sideas[\s\S]*Angular Material/);
      assert.match(pdfText, /Codeicus/);
      assert.match(pdfText, /Luxsys S\.R\.L/);
      assert.match(pdfText, /ECIC Systems/);
      assert.match(pdfText, /Ssr \.Net Developer/);
      assert.match(pdfText, /Sr Software Developer/);
      assert.match(pdfText, /Technical Leader/);
      assert.match(pdfText, /IT Developer/);
      assert.match(pdfText, /Technical Support/);
      assert.match(pdfText, /Ionic/);
      assert.match(pdfText, /DDD/);
    }
  }
});
