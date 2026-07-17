export const cvPdfVariants = ["modern", "ats"] as const;

export type CvPdfVariant = (typeof cvPdfVariants)[number];

export type CvPdfExport = {
  label: string;
  fileName: string;
  href: string;
};

const cvPdfBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const cvPdfExports: Record<CvPdfVariant, CvPdfExport> = {
  modern: {
    label: "Download Modern PDF CV",
    fileName: "patricio-montes-cv-modern.pdf",
    href: `${cvPdfBasePath}/downloads/patricio-montes-cv-modern.pdf`
  },
  ats: {
    label: "Download ATS PDF CV",
    fileName: "patricio-montes-cv-ats.pdf",
    href: `${cvPdfBasePath}/downloads/patricio-montes-cv-ats.pdf`
  }
};
