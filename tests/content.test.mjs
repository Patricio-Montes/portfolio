import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { languageCodes, portfolioContent, themeKeys } from "../src/content/portfolio.ts";

test("portfolio exposes the required language and theme options", () => {
  assert.deepEqual([...languageCodes], ["en", "es", "pt"]);
  assert.deepEqual([...themeKeys], ["midnight", "forest", "sunrise"]);

  for (const code of languageCodes) {
    assert.ok(portfolioContent.locales[code], `missing locale ${code}`);
    assert.ok(
      portfolioContent.languages.some((language) => language.code === code),
      `missing language selector option ${code}`
    );
  }
});

test("verified identity and contact facts are present without private CV data", () => {
  assert.equal(portfolioContent.profile.name, "Patricio Montes Güemez");
  assert.equal(portfolioContent.profile.title, "Software Developer");
  assert.equal(portfolioContent.profile.email, "montesgpatricio@gmail.com");
  assert.equal(
    portfolioContent.profile.linkedin,
    "https://www.linkedin.com/in/patricio-montes-88212448/"
  );

  const publicText = JSON.stringify(portfolioContent);
  for (const forbidden of [/\bDNI\b/i, /\bCUIL\b/i, /\bbirth date\b/i, /\bhome address\b/i, /\bphone number\b/i]) {
    assert.equal(forbidden.test(publicText), false, `forbidden public pattern found: ${forbidden}`);
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

test("project dependencies stay clean of PDF extraction packages", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const dependencyNames = [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {})
  ];

  assert.equal(
    dependencyNames.some((name) => /pdf|pypdf/i.test(name)),
    false,
    "PDF extraction packages must not be added to package.json"
  );
});
