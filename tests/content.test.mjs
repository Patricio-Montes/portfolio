import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent, themeKeys } from "../src/content/portfolio.ts";

test("portfolio exposes the required language and theme options", () => {
  assert.deepEqual([...languageCodes], ["en", "es", "pt"]);
  assert.deepEqual([...themeKeys], ["midnight", "graphite", "sunrise"]);
  assert.equal(themeKeys.includes("forest"), false);

  for (const code of languageCodes) {
    assert.ok(portfolioContent.locales[code], `missing locale ${code}`);
    assert.ok(
      portfolioContent.languages.some((language) => language.code === code),
      `missing language selector option ${code}`
    );
  }

  const publicText = JSON.stringify(portfolioContent);
  for (const forbidden of [/\bforest\b/i, /\bBosque\b/i, /\bFloresta\b/i]) {
    assert.equal(forbidden.test(publicText), false, `legacy forest theme copy found: ${forbidden}`);
  }
  assert.ok(portfolioContent.themes.some((theme) => theme.key === "graphite"));
  assert.ok(portfolioContent.themes.some((theme) => theme.label.es === "Grafito"));
  assert.ok(portfolioContent.themes.some((theme) => theme.label.pt === "Grafite"));
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
  }
});

test("experience timeline keeps verified roles, dates, and localized copy", () => {
  assert.equal(portfolioContent.experience.length, 11);

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

test("project dependencies stay clean of heavy PDF and Excel packages", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const dependencyNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {})
  ];

  assert.equal(
    dependencyNames.some((name) => /pdf|pypdf|xlsx|exceljs|spreadsheet/i.test(name)),
    false,
    "Heavy PDF or Excel packages must not be added to package.json"
  );
});
