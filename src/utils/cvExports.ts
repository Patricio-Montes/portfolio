import type { LanguageCode, LocalizedList, LocalizedText, PortfolioContent } from "@/content/portfolio";

export const cvExportVariants = ["standard", "ats"] as const;

export type CvExportVariant = (typeof cvExportVariants)[number];

export const cvExportFileNames: Record<CvExportVariant, string> = {
  standard: "patricio-montes-cv-standard.xls",
  ats: "patricio-montes-cv-ats.xls"
};

type Sheet = {
  name: string;
  rows: readonly (readonly string[])[];
};

function localize<T>(value: Readonly<Record<LanguageCode, T>>, language: LanguageCode): T {
  return value[language];
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function worksheetName(value: string): string {
  return value.replace(/[\\/?*[\]:]/g, " ").slice(0, 31);
}

function cell(value: string): string {
  return `<Cell><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`;
}

function row(values: readonly string[]): string {
  return `<Row>${values.map(cell).join("")}</Row>`;
}

function worksheet(sheet: Sheet): string {
  return `<Worksheet ss:Name="${escapeXml(worksheetName(sheet.name))}"><Table>${sheet.rows.map(row).join("")}</Table></Worksheet>`;
}

function workbook(sheets: readonly Sheet[]): string {
  return `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
${sheets.map(worksheet).join("")}
</Workbook>`;
}

function publicContactRows(content: PortfolioContent): string[][] {
  return [
    ["Name", content.profile.name],
    ["Title", content.profile.title],
    ["Email", content.profile.email],
    ["WhatsApp", content.profile.whatsapp],
    ["LinkedIn", content.profile.linkedin]
  ];
}

function buildStandardSheets(content: PortfolioContent, language: LanguageCode): Sheet[] {
  return [
    {
      name: "Profile",
      rows: [
        ["Field", "Value"],
        ...publicContactRows(content),
        ["Summary", content.locales[language].hero.subtitle],
        ["Availability", content.locales[language].hero.availability]
      ]
    },
    {
      name: "Experience",
      rows: [
        ["Company", "Role", "Period", "Highlights", "Technologies"],
        ...content.experience.map((item) => [
          item.company,
          item.role,
          localize(item.period, language),
          localize(item.highlights as LocalizedList, language).join(" "),
          item.tech.join(", ")
        ])
      ]
    },
    {
      name: "Skills",
      rows: [
        ["Category", "Skills"],
        ...content.skills.map((group) => [localize(group.name, language), group.items.join(", ")])
      ]
    },
    {
      name: "Projects",
      rows: [
        ["Name", "Context", "Description", "Link"],
        ...content.projects.map((project) => [
          project.name,
          localize(project.context, language),
          localize(project.description, language),
          project.link
        ])
      ]
    },
    {
      name: "Education",
      rows: [
        ["Name", "Institution", "Period", "Details"],
        ...content.education.map((item) => [
          localize(item.name, language),
          item.institution,
          localize(item.period, language),
          localize(item.details, language)
        ])
      ]
    }
  ];
}

function buildAtsRows(content: PortfolioContent, language: LanguageCode): string[][] {
  const skills = content.skills
    .map((group) => `${localize(group.name, language)}: ${group.items.join(", ")}`)
    .join(" | ");

  return [
    ["Section", "Searchable Text"],
    ["Contact", publicContactRows(content).map(([label, value]) => `${label}: ${value}`).join(" | ")],
    ["Summary", content.locales[language].hero.subtitle],
    ["Skills", skills],
    ...content.experience.map((item) => [
      "Experience",
      [
        item.role,
        item.company,
        localize(item.period, language),
        localize(item.highlights as LocalizedList, language).join(" "),
        item.tech.join(", ")
      ].join(" | ")
    ]),
    ...content.projects.map((project) => [
      "Project",
      [
        project.name,
        localize(project.context, language),
        localize(project.description, language),
        project.link
      ].join(" | ")
    ]),
    ...content.education.map((item) => [
      "Education",
      [
        localize(item.name as LocalizedText, language),
        item.institution,
        localize(item.period, language),
        localize(item.details, language)
      ].join(" | ")
    ])
  ];
}

export function buildCvSpreadsheetXml(
  content: PortfolioContent,
  language: LanguageCode,
  variant: CvExportVariant
): string {
  if (variant === "ats") {
    return workbook([{ name: "ATS CV", rows: buildAtsRows(content, language) }]);
  }

  return workbook(buildStandardSheets(content, language));
}
