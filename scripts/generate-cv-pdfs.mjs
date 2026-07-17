import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { finished } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import PDFDocument from "pdfkit";
import { portfolioContent } from "../src/content/portfolio.ts";
import { cvPdfExports } from "../src/utils/cvExports.ts";

const rootDirectory = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const outputDirectory = join(rootDirectory, "public", "downloads");
const language = "en";

function localize(value) {
  return value[language];
}

function publicContactLines() {
  return [
    portfolioContent.profile.email,
    `WhatsApp: ${portfolioContent.profile.whatsapp}`,
    portfolioContent.profile.linkedin
  ];
}

function addSectionTitle(doc, title, color = "#111827") {
  doc.moveDown(1.1).font("Helvetica-Bold").fontSize(13).fillColor(color).text(title.toUpperCase());
  doc.moveDown(0.35).strokeColor("#CBD5E1").lineWidth(0.75).moveTo(doc.x, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(0.55).fillColor("#111827");
}

function addBullet(doc, text, options = {}) {
  const startX = doc.x;
  const startY = doc.y;
  doc.circle(startX + 2.5, startY + 5.5, 1.8).fill(options.color ?? "#475569");
  doc.fillColor(options.textColor ?? "#111827").font("Helvetica").fontSize(options.size ?? 9.5).text(text, startX + 12, startY, {
    width: options.width ?? 470,
    lineGap: 1.5
  });
  doc.moveDown(0.25);
}

function ensureSpace(doc, requiredHeight = 120) {
  if (doc.y + requiredHeight > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
}

async function writePdf(fileName, render) {
  const outputPath = join(outputDirectory, fileName);
  const doc = new PDFDocument({
    size: "A4",
    margin: 48,
    compress: false,
    info: {
      Title: fileName.includes("ats") ? "Patricio Montes Güemez - ATS CV" : "Patricio Montes Güemez - Modern CV",
      Author: portfolioContent.profile.name,
      Subject: "Public portfolio CV export"
    }
  });
  const output = createWriteStream(outputPath);

  doc.pipe(output);
  render(doc);
  doc.end();

  await finished(output);
}

function renderModernCv(doc) {
  const copy = portfolioContent.locales[language];

  doc.rect(0, 0, doc.page.width, 145).fill("#111827");
  doc.fillColor("#F8FAFC").font("Helvetica-Bold").fontSize(25).text(portfolioContent.profile.name, 48, 42, {
    width: 330
  });
  doc.font("Helvetica").fontSize(12).fillColor("#CBD5E1").text(portfolioContent.profile.title, 48, 76);
  doc.fontSize(8.5).fillColor("#E2E8F0").text(publicContactLines().join("\n"), 365, 43, {
    width: 180,
    align: "right",
    lineGap: 2
  });

  doc.x = 48;
  doc.y = 172;
  doc.fillColor("#111827").font("Helvetica").fontSize(10.5).text(copy.hero.subtitle, {
    width: 500,
    lineGap: 2
  });

  addSectionTitle(doc, "Core skills", "#0F172A");
  const skills = portfolioContent.skills
    .map((group) => `${localize(group.name)}: ${group.items.join(", ")}`)
    .join("  •  ");
  doc.font("Helvetica").fontSize(9.2).fillColor("#334155").text(skills, { width: 500, lineGap: 2 });

  addSectionTitle(doc, "Experience", "#0F172A");
  for (const item of portfolioContent.experience) {
    ensureSpace(doc, 92);
    doc.font("Helvetica-Bold").fontSize(10.7).fillColor("#111827").text(`${item.role} · ${item.company}`, {
      width: 350,
      continued: true
    });
    doc.font("Helvetica").fontSize(8.5).fillColor("#64748B").text(localize(item.period), {
      align: "right"
    });
    doc.moveDown(0.25);
    for (const highlight of localize(item.highlights).slice(0, 2)) {
      addBullet(doc, highlight, { size: 8.8, width: 480 });
    }
    doc.font("Helvetica").fontSize(8).fillColor("#475569").text(item.tech.join(" · "), {
      width: 500
    });
    doc.moveDown(0.35);
  }

  addSectionTitle(doc, "Selected projects", "#0F172A");
  for (const project of portfolioContent.projects.filter((projectItem) => projectItem.link).slice(0, 3)) {
    ensureSpace(doc, 62);
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#111827").text(project.name);
    doc.font("Helvetica").fontSize(8.7).fillColor("#334155").text(localize(project.description), { width: 500, lineGap: 1.5 });
    doc.fontSize(8).fillColor("#2563EB").text(project.link, { width: 500 });
    doc.moveDown(0.45);
  }

  addSectionTitle(doc, "Education and training", "#0F172A");
  for (const item of portfolioContent.education.slice(0, 5)) {
    ensureSpace(doc, 42);
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#111827").text(localize(item.name), { continued: true });
    doc.font("Helvetica").fontSize(8).fillColor("#64748B").text(` · ${item.institution}`);
  }
}

function renderAtsCv(doc) {
  const copy = portfolioContent.locales[language];

  doc.font("Helvetica-Bold").fontSize(18).fillColor("#000000").text(portfolioContent.profile.name);
  doc.font("Helvetica").fontSize(10).text(portfolioContent.profile.title);
  doc.moveDown(0.35).fontSize(9).text(publicContactLines().join(" | "), { width: 500 });

  addSectionTitle(doc, "Professional summary", "#000000");
  doc.font("Helvetica").fontSize(10).fillColor("#000000").text(copy.hero.subtitle, { width: 500, lineGap: 2 });

  addSectionTitle(doc, "Skills", "#000000");
  for (const group of portfolioContent.skills) {
    doc.font("Helvetica-Bold").fontSize(9.5).text(`${localize(group.name)}: `, { continued: true });
    doc.font("Helvetica").fontSize(9.5).text(group.items.join(", "), { width: 500 });
  }

  addSectionTitle(doc, "Professional experience", "#000000");
  for (const item of portfolioContent.experience) {
    ensureSpace(doc, 85);
    doc.font("Helvetica-Bold").fontSize(10).text(`${item.role} | ${item.company} | ${localize(item.period)}`);
    for (const highlight of localize(item.highlights)) {
      addBullet(doc, highlight, { color: "#000000", textColor: "#000000", size: 8.7, width: 480 });
    }
    doc.font("Helvetica").fontSize(8.5).text(`Technologies: ${item.tech.join(", ")}`, { width: 500 });
    doc.moveDown(0.35);
  }

  addSectionTitle(doc, "Projects", "#000000");
  for (const project of portfolioContent.projects) {
    ensureSpace(doc, 55);
    doc.font("Helvetica-Bold").fontSize(9.5).text(`${project.name} | ${localize(project.context)}`);
    doc.font("Helvetica").fontSize(8.7).text([localize(project.description), project.link].filter(Boolean).join(" "), {
      width: 500,
      lineGap: 1.5
    });
    doc.moveDown(0.35);
  }

  addSectionTitle(doc, "Education", "#000000");
  for (const item of portfolioContent.education) {
    ensureSpace(doc, 36);
    doc.font("Helvetica-Bold").fontSize(9).text(`${localize(item.name)} | ${item.institution}`);
    doc.font("Helvetica").fontSize(8.5).text(`${localize(item.period)} | ${localize(item.details)}`, { width: 500 });
  }
}

await mkdir(outputDirectory, { recursive: true });
await writePdf(cvPdfExports.modern.fileName, renderModernCv);
await writePdf(cvPdfExports.ats.fileName, renderAtsCv);
