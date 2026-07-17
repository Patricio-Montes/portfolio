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

  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");
  const siegwerk = portfolioContent.projects.find((project) => project.name === "Siegwerk São Paulo implementation");
  const utnRosario = portfolioContent.projects.find((project) => project.name === "UTN FRRO research project");
  assert.ok(databases?.items.includes("Redis"), "Databases must include Redis");
  assert.equal(platforms?.items.includes("Redis"), false);
  assert.equal(siegwerk?.context.en, "Luxsys S.R.L — June 2018");
  assert.equal(utnRosario?.context.en, "UTN FRRO — March 2012 to December 2012");

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
      if (language === "en") {
        assert.match(pdfText, /Software Developer with 10\+/);
        assert.doesNotMatch(pdfText, /Software engineer with 10\+/i);
      }
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
  assert.match(pageText, /Whimsical/);
  assert.match(pageText, /JSF/);
  assert.doesNotMatch(pageText, /Ionic/);
  assert.match(pageText, /DDD/);
  assert.match(pageText, /Gradle/);
  assert.match(pageText, /SonarQube/);
  assert.match(pageText, /supermarket shelf survey app/i);
  assert.match(pageText, /WCF communication module/i);
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


  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");
  const siegwerk = portfolioContent.projects.find((project) => project.name === "Siegwerk São Paulo implementation");
  const utnRosario = portfolioContent.projects.find((project) => project.name === "UTN FRRO research project");
  assert.ok(databases?.items.includes("Redis"), "Databases must include Redis");
  assert.equal(platforms?.items.includes("Redis"), false);
  assert.equal(siegwerk?.context.en, "Luxsys S.R.L — June 2018");
  assert.equal(utnRosario?.context.en, "UTN FRRO — March 2012 to December 2012");

  const files = (await readdir(new URL("../public/downloads/", import.meta.url))).filter((file) =>
    /^patricio-montes-cv-(modern|ats)-.+\.pdf$/.test(file)
  );
  assert.equal(files.some((file) => /-pt\.pdf$/i.test(file)), false);

  for (const language of cvPdfExportLanguages) {
    for (const variant of cvPdfVariants) {
      const pdf = await readFile(new URL(`../public/downloads/${getCvPdfExports(language)[variant].fileName}`, import.meta.url));
      const pdfText = extractPdfText(pdf);

      assert.doesNotMatch(pdfText, /\bPortuguese\b|\bPortugués\b|\bPortuguês\b|\bPT\b|\bpt\b/);
      assert.match(pdfText, /Whimsical/);
      assert.match(pdfText, /JSF/);
      assert.doesNotMatch(pdfText, new RegExp(genericMaterialFramework));
      assert.match(pdfText, /Frameworks: [^\n]*Angular Material/);
      assert.match(pdfText, /Sideas[\s\S]*Angular Material/);
      assert.match(pdfText, /Codeicus/);
      assert.match(pdfText, /Luxsys S\.R\.L/);
      assert.doesNotMatch(pdfText, /ECIC Systems|Technical Support|Web Designer|Luxsys S\.R\.L \/ Freelance/);
      assert.doesNotMatch(pdfText, /March 2020 — December 2020|Marzo 2020 — Diciembre 2020/);
      const skillStart = language === "en" ? (variant === "modern" ? "CORE SKILLS" : "SKILLS") : (variant === "modern" ? "HABILIDADES PRINCIPALES" : "HABILIDADES");
      const experienceStart = language === "en" ? (variant === "modern" ? "EXPERIENCE" : "PROFESSIONAL EXPERIENCE") : (variant === "modern" ? "EXPERIENCIA" : "EXPERIENCIA PROFESIONAL");
      const skillsText = textBetween(
        pdfText,
        skillStart,
        experienceStart
      );
      assert.doesNotMatch(skillsText, /Platforms: [\s\S]*Redis|Plataformas: [\s\S]*Redis/);
      assert.match(skillsText, /Databases: [\s\S]*Redis|Bases de datos: [\s\S]*Redis/);
      assert.match(pdfText, /Siegwerk São Paulo implementation \| Luxsys S\.R\.L — June 2018|Siegwerk São Paulo implementation \| Luxsys S\.R\.L — Junio 2018/);
      assert.match(pdfText, /UTN FRRO research project \| UTN FRRO — March 2012 to December 2012|UTN FRRO research project \| UTN FRRO — Marzo 2012 a Diciembre 2012/);
      const unxText = textBetween(pdfText, "UNX Digital / Grupo Prominente", "Codeicus");
      const codeicusText = textBetween(pdfText, "Codeicus", "Luxsys S.R.L");
      const luxsysText = textBetween(pdfText, "Luxsys S.R.L", variant === "modern" ? "SELECTED PROJECTS" : "PROJECTS");

      assert.doesNotMatch(unxText, /Ssr \.Net Developer/);
      assert.doesNotMatch(pdfText, /Sr Software Architect/);
      assert.match(unxText, /Software Architect[\s\S]*Sr Software Developer/, "UNX PDF group must show final role before earlier role");
      assert.match(codeicusText, /Sr Software Developer[\s\S]*Ssr \.Net Developer/, "Codeicus PDF group must show final role before earlier role");
      assert.match(luxsysText, /Technical Leader[\s\S]*IT Developer/, "Luxsys PDF group must show final role before earlier role");
      assert.match(pdfText, /Sr Software Developer/);
      assert.match(pdfText, /Technical Leader/);
      assert.match(pdfText, /IT Developer/);
      assert.doesNotMatch(pdfText, /Ionic/);
      assert.match(pdfText, /DDD/);
      assert.match(pdfText, /Gradle/);
      assert.match(pdfText, /SonarQube/);
      assert.match(pdfText, /supermarket shelf survey app|app de relevamiento de góndolas/i);
      assert.match(pdfText, /WCF communication module|módulo de comunicación WCF/i);
    }
  }
});
