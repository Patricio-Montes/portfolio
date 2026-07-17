import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent, themeKeys } from "../src/content/portfolio.ts";
import { cvPdfExportLanguages } from "../src/utils/cvExports.ts";

test("portfolio exposes the required language and theme options", () => {
  assert.deepEqual([...languageCodes], ["en", "es"]);
  assert.deepEqual([...cvPdfExportLanguages], [...languageCodes]);
  assert.deepEqual([...themeKeys], ["midnight", "graphite", "editorial"]);
  assert.equal(themeKeys.includes("forest"), false);
  assert.equal(themeKeys.includes("sunrise"), false);
  assert.equal(themeKeys.includes("notebook"), false);

  for (const code of languageCodes) {
    assert.ok(portfolioContent.locales[code], `missing locale ${code}`);
    assert.ok(
      portfolioContent.languages.some((language) => language.code === code),
      `missing language selector option ${code}`
    );
  }

  const publicText = JSON.stringify(portfolioContent);
  for (const forbidden of [/\bforest\b/i, /\bBosque\b/i, /\bFloresta\b/i, /\bPortuguese\b/i, /\bPortugués\b/i, /\bPortuguês\b/i, /\bPT\b/, /\bpt\b/, /\bsunrise\b/i, /\bAmanecer\b/i, /\bnotebook\b/i, /\bCuaderno\b/i]) {
    assert.equal(forbidden.test(publicText), false, `forbidden public copy found: ${forbidden}`);
  }
  assert.ok(portfolioContent.themes.some((theme) => theme.key === "graphite"));
  assert.ok(portfolioContent.themes.some((theme) => theme.key === "editorial" && theme.label.en === "Editorial" && theme.label.es === "Editorial"));
  assert.ok(portfolioContent.themes.some((theme) => theme.label.es === "Grafito"));
  assert.equal(portfolioContent.themes.length, 3);
  assert.equal(portfolioContent.languages.length, 2);
});

test("portfolio shell defaults to Spanish language and editorial theme", async () => {
  const shell = await readFile(new URL("../src/components/PortfolioShell.tsx", import.meta.url), "utf8");

  assert.match(shell, /useState<LanguageCode>\("es"\)/);
  assert.match(shell, /useState<ThemeKey>\("editorial"\)/);
  assert.doesNotMatch(shell, /\bnotebook\b/);
});

test("verified identity and contact facts are present without private CV data", () => {
  assert.equal(portfolioContent.profile.name, "Patricio Montes Güemez");
  assert.equal(portfolioContent.profile.title, "Software Developer");
  assert.equal(portfolioContent.profile.email, "montesgpatricio@gmail.com");
  assert.equal(portfolioContent.profile.whatsapp, "https://wa.me/5491140518040");
  assert.equal(
    portfolioContent.profile.linkedin,
    "https://www.linkedin.com/in/patricio-montes-88212448/"
  );
  assert.deepEqual(Object.keys(portfolioContent.profile).sort(), [
    "email",
    "linkedin",
    "name",
    "title",
    "whatsapp"
  ]);

  const publicText = JSON.stringify(portfolioContent);
  for (const forbidden of [
    /\bDNI\b/i,
    /\bCUIL\b/i,
    /\bbirth date\b/i,
    /\bhome address\b/i,
    /\bphone\b/i,
    /\+54\s+9\s+11/i,
    /4051\s+8040/
  ]) {
    assert.equal(forbidden.test(publicText), false, `forbidden public pattern found: ${forbidden}`);
  }

  for (const code of languageCodes) {
    const contact = portfolioContent.locales[code].sections.contact;
    assert.match(contact.whatsappLabel, /WhatsApp/i);
    assert.match(contact.emailLabel, /mail|email|correo/i);
    assert.match(contact.linkedinLabel, /LinkedIn/i);

    const exportCopy = portfolioContent.locales[code].exports;
    const publicExportText = JSON.stringify(exportCopy);
    assert.match(publicExportText, /Modern PDF|PDF moderno|PDF moderno/i);
    assert.match(publicExportText, /ATS PDF|PDF ATS/i);
    assert.doesNotMatch(publicExportText, /\bprint\b|imprimir|salvar|guardar/i);
    assert.doesNotMatch(publicExportText, /\.xls|excel/i);
  }
});

test("experience timeline keeps verified roles, dates, and localized copy", () => {
  const urbetrack = portfolioContent.experience.find((item) => item.company === "Urbetrack");
  assert.ok(urbetrack);
  assert.equal(urbetrack.role, "Sr .Net Developer");
  assert.equal(urbetrack.period.en, "July 2024 — April 2026");
  assert.ok(urbetrack.tech.includes(".NET"));

  const architect = portfolioContent.experience.find(
    (item) => item.company === "UNX Digital / Grupo Prominente" && item.role === "Software Architect"
  );
  assert.ok(architect);
  assert.ok(architect.tech.includes("Ocelot"));
  assert.ok(architect.highlights.en.join(" ").includes("OIDC"));

  for (const item of portfolioContent.experience) {
    for (const code of languageCodes) {
      assert.ok(item.period[code], `${item.company} missing ${code} period`);
      assert.ok(item.highlights[code].length > 0, `${item.company} missing ${code} highlights`);
    }
  }
});

test("hero focus chips use the requested professional positioning only", () => {
  for (const code of languageCodes) {
    assert.deepEqual(portfolioContent.locales[code].hero.focusAreas, [
      ".NET",
      "Angular",
      "Google Cloud",
      "Azure",
      "Clean Code",
      "Clean Architecture"
    ]);
    assert.equal(portfolioContent.locales[code].hero.focusAreas.includes("AI-First"), false);
    assert.equal(portfolioContent.locales[code].hero.focusAreas.includes("Code review"), false);
  }
});

test("page profile summary is concise and covers the required positioning", () => {
  const expectedSummaries = {
    en: "Software Developer with 10+ years building scalable, maintainable systems through architecture, automation, Clean Code, Clean Architecture, DDD, SDD/TDD, and AI agents directed by human technical judgment.",
    es: "Desarrollador de Software con 10+ años creando soluciones escalables y mantenibles con arquitectura, automatización, Clean Code, Clean Architecture, DDD, SDD/TDD y agentes IA bajo dirección técnica humana."
  };

  for (const code of languageCodes) {
    const summary = portfolioContent.locales[code].hero.subtitle;

    assert.equal(summary, expectedSummaries[code]);
    assert.ok(summary.length <= 210, `${code} summary must stay short enough for PDF layout`);
    if (code === "en") {
      assert.match(summary, /^Software Developer\b/);
      assert.doesNotMatch(summary, /^Software engineer\b/i);
    }
    if (code === "es") {
      assert.match(summary, /^Desarrollador de Software\b/);
      assert.doesNotMatch(summary, /^Ingeniero de software\b/);
    }
    assert.match(summary, /10\+/);
    assert.match(summary, /architecture|arquitectura/i);
    assert.match(summary, /automation|automatización/i);
    assert.match(summary, /Clean Code/);
    assert.match(summary, /Clean Architecture/);
    assert.match(summary, /DDD/);
    assert.match(summary, /SDD\/TDD/);
    assert.match(summary, /AI agents|agentes IA/i);
    assert.match(summary, /human technical|técnica humana/i);
    assert.match(summary, /scalable|escalables/i);
    assert.match(summary, /maintainable|mantenibles/i);
  }
});

test("experience ownership and same-company data preserve verified CV facts", () => {
  const codeicusItems = portfolioContent.experience.filter((item) => item.company === "Codeicus");

  assert.equal(codeicusItems.length, 2);
  assert.equal(codeicusItems[0].role, "Ssr .Net Developer");
  assert.equal(codeicusItems[0].period.en, "October 2019 — September 2021");
  assert.equal(codeicusItems[0].period.es, "Octubre 2019 — Septiembre 2021");
  assert.ok(codeicusItems[0].tech.includes("Gradle"));
  assert.ok(codeicusItems[0].tech.includes("Python"));
  assert.ok(codeicusItems[0].tech.includes("SonarQube"));
  assert.match(codeicusItems[0].highlights.en.join(" "), /Java DDD APIs/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /ERP full-stack components/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /Python backup assistant/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /financial app/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /insurance broker/i);
  assert.match(codeicusItems[0].highlights.en.join(" "), /Jira, Jenkins, GitLab, and SonarQube/i);
  assert.equal(codeicusItems[1].role, "Sr Software Developer");
  assert.equal(codeicusItems[1].period.en, "December 2020 — September 2021");
  assert.equal(codeicusItems[1].period.es, "Diciembre 2020 — Septiembre 2021");
  assert.ok(codeicusItems[1].tech.includes("Maven"));
  assert.ok(codeicusItems[1].tech.includes("JSF"));
  assert.ok(codeicusItems[1].tech.includes("Whimsical"));
  assert.ok(codeicusItems[1].tech.includes("React Native"));
  assert.ok(codeicusItems[1].tech.includes("C#"));
  assert.equal(codeicusItems[1].tech.includes("Ionic"), false);
  assert.match(codeicusItems[1].highlights.en.join(" "), /credit management web tools/i);
  assert.match(codeicusItems[1].highlights.en.join(" "), /construction ERP/i);
  assert.match(codeicusItems[1].highlights.en.join(" "), /supermarket shelf survey app/i);
  assert.match(codeicusItems[1].highlights.en.join(" "), /WCF communication module/i);

  const luxsysItems = portfolioContent.experience.filter((item) => item.company === "Luxsys S.R.L");
  assert.equal(luxsysItems.length, 2);
  assert.equal(luxsysItems[0].role, "IT Developer");
  assert.equal(luxsysItems[0].period.en, "October 2016 — December 2018");
  assert.equal(luxsysItems[0].period.es, "Octubre 2016 — Diciembre 2018");
  assert.equal(luxsysItems[1].role, "Technical Leader");
  assert.equal(luxsysItems[1].period.en, "December 2018 — October 2019");
  assert.equal(luxsysItems[1].period.es, "Diciembre 2018 — Octubre 2019");
  assert.equal(
    portfolioContent.experience.some(
      (item) => ["IT Developer", "Technical Leader"].includes(item.role) && item.company !== "Luxsys S.R.L"
    ),
    false,
    "Technical Leader and IT Developer must be owned by Luxsys S.R.L exactly"
  );

  const unxItems = portfolioContent.experience.filter((item) => item.company === "UNX Digital / Grupo Prominente");
  assert.equal(unxItems.length, 2);
  assert.deepEqual(
    unxItems.map((item) => item.role),
    ["Sr Software Developer", "Software Architect"],
    "source data remains chronological; rendering/PDF grouping presents latest role first"
  );
  assert.equal(unxItems[0].period.en, "September 2021 — April 2022");
  assert.equal(unxItems[0].period.es, "Septiembre 2021 — Abril 2022");
  assert.equal(unxItems[1].period.en, "April 2022 — November 2022");
  assert.equal(unxItems[1].period.es, "Abril 2022 — Noviembre 2022");

  const publicText = JSON.stringify(portfolioContent);
  for (const forbidden of [
    /ECIC Systems/,
    /Technical Support/,
    /Web Designer/,
    /Luxsys S\.R\.L \/ Freelance/,
    /March 2020 — December 2020/,
    /Marzo 2020 — Diciembre 2020/,
    /Sr Software Architect/
  ]) {
    assert.doesNotMatch(publicText, forbidden, `forbidden experience content found: ${forbidden}`);
  }
  assert.equal(
    unxItems.some((item) => item.role === "Ssr .Net Developer"),
    false,
    "UNX must not own Ssr .Net Developer"
  );
});

test("education avoids unverified graduation or fluency claims", () => {
  const engineering = portfolioContent.education.find((item) =>
    item.institution.includes("Universidad Tecnológica Nacional")
  );
  assert.ok(engineering);
  assert.match(engineering.period.en, /listed as ongoing in the CV/);
  assert.match(engineering.details.en, /without adding unverified graduation/);

  const englishTraining = portfolioContent.education.filter((item) =>
    item.name.en.includes("English training")
  );
  assert.equal(englishTraining.length, 2);
  assert.ok(englishTraining.some((item) => item.details.en.includes("no fluency claim")));
});

test("added skills and verified public projects are present", () => {
  const genericMaterialFramework = ["Material", "Design"].join(" ");
  const frameworks = portfolioContent.skills.find((group) => group.name.en === "Frameworks");
  assert.ok(frameworks, "missing Frameworks skill group");
  assert.ok(frameworks.items.includes("Angular Material"), "Frameworks must include Angular Material");
  assert.equal(frameworks.items.includes(genericMaterialFramework), false, "must not add generic Material framework");

  const sideas = portfolioContent.experience.find((item) => item.company === "Sideas");
  assert.ok(sideas, "missing Sideas experience");
  assert.ok(sideas.tech.includes("Angular Material"), "Sideas tech must keep Angular Material");

  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  assert.ok(databases, "missing Databases skill group");
  assert.ok(databases.items.includes("Supabase"));
  assert.ok(databases.items.includes("MongoDB"));

  const designAndQa = portfolioContent.skills.find((group) => group.name.en === "Design and QA");
  assert.ok(designAndQa, "missing Design and QA skill group");
  for (const tool of ["Excalidraw", "Figma", "Obsidian"]) {
    assert.ok(designAndQa.items.includes(tool), `missing ${tool}`);
  }

  const circuit = portfolioContent.projects.find((project) => project.link === "https://circuitoarredepadel.com/");
  assert.ok(circuit, "missing sports circuit project");
  assert.equal(circuit.name, "Gestión de circuito deportivo");
  assert.match(circuit.description.en, /tournaments/i);
  assert.match(circuit.description.es, /torneos/i);

  const incoders = portfolioContent.projects.find((project) => project.link === "https://www.incoders.com.ar/");
  assert.ok(incoders, "missing Incoders project");
  assert.match(incoders.description.en, /admin panel/i);
  assert.match(incoders.description.en, /financial dashboard/i);
});


test("skills move Redis from Platforms to Databases without duplicates", () => {
  const databases = portfolioContent.skills.find((group) => group.name.en === "Databases");
  const platforms = portfolioContent.skills.find((group) => group.name.en === "Platforms");

  assert.ok(databases, "missing Databases skill group");
  assert.ok(platforms, "missing Platforms skill group");
  assert.ok(databases.items.includes("Redis"), "Databases must include Redis");
  assert.equal(platforms.items.includes("Redis"), false, "Platforms must not include Redis");

  const allSkillItems = portfolioContent.skills.flatMap((group) => group.items);
  assert.equal(allSkillItems.filter((item) => item === "Redis").length, 1, "Redis must not be duplicated");
});

test("project contexts use corrected company and institution associations", () => {
  const siegwerk = portfolioContent.projects.find((project) => project.name === "Siegwerk São Paulo implementation");
  const utnRosario = portfolioContent.projects.find((project) => project.name === "UTN FRRO research project");

  assert.ok(siegwerk);
  assert.equal(siegwerk.context.en, "Luxsys S.R.L — June 2018");
  assert.equal(siegwerk.context.es, "Luxsys S.R.L — Junio 2018");
  assert.ok(utnRosario);
  assert.equal(utnRosario.context.en, "UTN FRRO — March 2012 to December 2012");
  assert.equal(utnRosario.context.es, "UTN FRRO — Marzo 2012 a Diciembre 2012");
});

test("hero card back exposes accessible bilingual professional descriptions", () => {
  assert.match(portfolioContent.locales.es.hero.cardBack, /Ingeniería de Software/);
  assert.match(portfolioContent.locales.es.hero.cardBack, /Clean Code y Clean Architecture/);
  assert.match(portfolioContent.locales.es.hero.cardBack, /Domain-Driven Design/);
  assert.match(portfolioContent.locales.es.hero.cardBack, /agentes de Inteligencia Artificial especializados/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /Software Engineering/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /Clean Code and Clean Architecture/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /Domain-Driven Design/);
  assert.match(portfolioContent.locales.en.hero.cardBack, /specialized Artificial Intelligence agents/);

  for (const code of languageCodes) {
    assert.ok(portfolioContent.locales[code].hero.flipToBackLabel);
    assert.ok(portfolioContent.locales[code].hero.flipToFrontLabel);
  }
});

test("project dependencies stay clean of heavy PDF and Excel packages", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const dependencyNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {})
  ];

  assert.equal(
    dependencyNames.some((name) => /xlsx|exceljs|spreadsheet/i.test(name)),
    false,
    "Excel packages must not be added to package.json"
  );
});
