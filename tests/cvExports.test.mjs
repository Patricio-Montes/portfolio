import assert from "node:assert/strict";
import test from "node:test";
import { portfolioContent } from "../src/content/portfolio.ts";
import {
  buildCvSpreadsheetXml,
  cvExportFileNames,
  cvExportVariants
} from "../src/utils/cvExports.ts";

test("CV exports expose standard and ATS SpreadsheetML variants", () => {
  assert.deepEqual([...cvExportVariants], ["standard", "ats"]);
  assert.equal(cvExportFileNames.standard, "patricio-montes-cv-standard.xls");
  assert.equal(cvExportFileNames.ats, "patricio-montes-cv-ats.xls");

  for (const variant of cvExportVariants) {
    const xml = buildCvSpreadsheetXml(portfolioContent, "en", variant);
    assert.match(xml, /^<\?xml version="1\.0"\?>/);
    assert.match(xml, /<Workbook\b/);
    assert.match(xml, /urn:schemas-microsoft-com:office:spreadsheet/);
    assert.match(xml, /Patricio Montes Güemez/);
    assert.match(xml, /montesgpatricio@gmail\.com/);
    assert.match(xml, /WhatsApp/);
    assert.match(xml, /https:\/\/wa\.me\/5491140518040/);
    assert.match(xml, /LinkedIn/);
    assert.doesNotMatch(xml, /\bPhone\b/i);
    assert.doesNotMatch(xml, /\+54\s+9\s+11/i);
    assert.doesNotMatch(xml, /4051\s+8040/);
  }
});

test("standard Excel XML keeps structured portfolio sections", () => {
  const xml = buildCvSpreadsheetXml(portfolioContent, "en", "standard");

  for (const expectedSheet of ["Profile", "Experience", "Skills", "Projects", "Education"]) {
    assert.match(xml, new RegExp(`<Worksheet ss:Name="${expectedSheet}"`));
  }
  assert.match(xml, /Gestión de circuito deportivo/);
  assert.match(xml, /https:\/\/circuitoarredepadel\.com\//);
});

test("ATS Excel XML is optimized as a single scanner-friendly sheet", () => {
  const xml = buildCvSpreadsheetXml(portfolioContent, "en", "ats");

  assert.match(xml, /<Worksheet ss:Name="ATS CV"/);
  assert.doesNotMatch(xml, /<Worksheet ss:Name="Profile"/);
  assert.match(xml, /Section/);
  assert.match(xml, /Searchable Text/);
  assert.match(xml, /Supabase/);
  assert.match(xml, /MongoDB/);
});
