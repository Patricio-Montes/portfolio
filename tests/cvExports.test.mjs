import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent } from "../src/content/portfolio.ts";
import { cvPdfExports, cvPdfExportLanguages, cvPdfVariants, getCvPdfExports } from "../src/utils/cvExports.ts";

function extractPdfText(pdf) {
  return [...pdf.toString("latin1").matchAll(/<([0-9A-Fa-f]+)>/g)]
    .map((match) => Buffer.from(match[1], "hex").toString("latin1"))
    .join("")
    .replace(/\x97/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function textBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, `missing start marker: ${start}`);
  const endIndex = text.indexOf(end, startIndex + start.length);

  return endIndex === -1 ? text.slice(startIndex) : text.slice(startIndex, endIndex);
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
      if (language === "es") {
        assert.match(pdfText, /Desarrollador de Software con 10\+/);
        assert.doesNotMatch(pdfText, /Ingeniero de software con 10\+/);
      }
    }
  }
});

test("generated PDF CVs mirror corrected page data", async () => {
  const genericMaterialFramework = ["Material", "Design"].join(" ");
  const pageText = JSON.stringify(portfolioContent);
  const frameworks = portfolioContent.skills.find((group) => group.name.en === "Frameworks");
  const sideas = portfolioContent.experience.find((item) => item.company === "Sideas");
  const unxItems = portfolioContent.experience.filter((item) => item.company === "UNX Digital / Grupo Prominente");
  const codeicusItems = portfolioContent.experience.filter((item) => item.company === "Codeicus");
  const luxsysItems = portfolioContent.experience.filter((item) => item.company === "Luxsys S.R.L");

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
  assert.doesNotMatch(pageText, /ECIC Systems|Technical Support|Web Designer|Luxsys S\.R\.L \/ Freelance/);
  assert.deepEqual(
    unxItems.map((item) => `${item.role} | ${item.period.en}`),
    ["Sr Software Developer | September 2021 — April 2022", "Software Architect | April 2022 — November 2022"]
  );
  assert.equal(unxItems.some((item) => item.role === "Ssr .Net Developer"), false);
  assert.deepEqual(
    codeicusItems.map((item) => `${item.role} | ${item.period.en}`),
    ["Ssr .Net Developer | October 2019 — September 2021", "Sr Software Developer | December 2020 — September 2021"]
  );
  assert.deepEqual(
    luxsysItems.map((item) => `${item.role} | ${item.period.en}`),
    ["IT Developer | October 2016 — December 2018", "Technical Leader | December 2018 — October 2019"]
  );

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
      assert.doesNotMatch(pdfText, /ECIC Systems|Technical Support|Web Designer|Luxsys S\.R\.L \/ Freelance/);
      assert.doesNotMatch(pdfText, /March 2020 — December 2020|Marzo 2020 — Diciembre 2020/);
      const unxText = textBetween(pdfText, "UNX Digital / Grupo Prominente", "Codeicus");
      const codeicusText = textBetween(pdfText, "Codeicus", "Luxsys S.R.L");
      const luxsysText = textBetween(pdfText, "Luxsys S.R.L", variant === "modern" ? "SELECTED PROJECTS" : "PROJECTS");

      assert.doesNotMatch(unxText, /Ssr \.Net Developer/);
      assert.doesNotMatch(pdfText, /Sr Software Architect/);
      assert.match(unxText, /Sr Software Developer[\s\S]*September 2021 — April 2022|Sr Software Developer[\s\S]*Septiembre 2021 — Abril 2022/);
      assert.match(unxText, /Software Architect[\s\S]*April 2022 — November 2022|Software Architect[\s\S]*Abril 2022 — Noviembre 2022/);
      assert.match(codeicusText, /Ssr \.Net Developer[\s\S]*October 2019 — September 2021|Ssr \.Net Developer[\s\S]*Octubre 2019 — Septiembre 2021/);
      assert.match(codeicusText, /Sr Software Developer[\s\S]*December 2020 — September 2021|Sr Software Developer[\s\S]*Diciembre 2020 — Septiembre 2021/);
      assert.match(luxsysText, /IT Developer[\s\S]*October 2016 — December 2018|IT Developer[\s\S]*Octubre 2016 — Diciembre 2018/);
      assert.match(luxsysText, /Technical Leader[\s\S]*December 2018 — October 2019|Technical Leader[\s\S]*Diciembre 2018 — Octubre 2019/);
      assert.match(pdfText, /Sr Software Developer/);
      assert.match(pdfText, /Technical Leader/);
      assert.match(pdfText, /IT Developer/);
      assert.match(pdfText, /Ionic/);
      assert.match(pdfText, /DDD/);
    }
  }
});
