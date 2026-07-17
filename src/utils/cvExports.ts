import type { LanguageCode } from "@/content/portfolio";

export const cvPdfVariants = ["modern", "ats"] as const;
export const cvPdfExportLanguages = ["en", "es"] as const;

export type CvPdfVariant = (typeof cvPdfVariants)[number];
export type CvPdfExportLanguage = (typeof cvPdfExportLanguages)[number];

export type CvPdfExport = {
  label: string;
  fileName: string;
  href: string;
};

const cvPdfBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function buildExport(fileName: string, label: string): CvPdfExport {
  return {
    label,
    fileName,
    href: `${cvPdfBasePath}/downloads/${fileName}`
  };
}

export const cvPdfExports: Record<CvPdfExportLanguage, Record<CvPdfVariant, CvPdfExport>> = {
  en: {
    modern: buildExport("patricio-montes-cv-modern-en.pdf", "Download Modern PDF CV"),
    ats: buildExport("patricio-montes-cv-ats-en.pdf", "Download ATS PDF CV")
  },
  es: {
    modern: buildExport("patricio-montes-cv-modern-es.pdf", "Download Modern PDF CV"),
    ats: buildExport("patricio-montes-cv-ats-es.pdf", "Download ATS PDF CV")
  }
};

export function getCvPdfExports(language: LanguageCode): Record<CvPdfVariant, CvPdfExport> {
  return cvPdfExports[language];
}

export const cvPdfDefaultExports: Record<CvPdfVariant, CvPdfExport> = cvPdfExports.en;
