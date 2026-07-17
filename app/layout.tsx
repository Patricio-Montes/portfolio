import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patricio Montes Güemez | Software Developer",
  description:
    "Multilingual static portfolio for Patricio Montes Güemez, a Software Developer focused on .NET APIs, cloud integrations, and engineering tooling.",
  applicationName: "Patricio Montes Güemez Portfolio",
  authors: [{ name: "Patricio Montes Güemez" }],
  creator: "Patricio Montes Güemez",
  keywords: [
    "Patricio Montes Güemez",
    "Software Developer",
    ".NET",
    "C#",
    "Java",
    "TypeScript",
    "Azure",
    "Google Cloud Platform"
  ],
  openGraph: {
    title: "Patricio Montes Güemez | Software Developer",
    description:
      "Static multilingual portfolio highlighting verified experience in .NET, APIs, cloud platforms, integrations, and engineering workflows.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_AR", "pt_BR"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
