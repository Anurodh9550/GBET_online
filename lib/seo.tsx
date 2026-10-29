import type { Metadata } from "next";
import { SITE } from "@/lib/site";

const defaultTitle = `${SITE.name} | ${SITE.fullName}`;
const defaultDescription = `${SITE.tagline}. Admissions Open 2027 for diploma programmes in Interior Design, Culinary Arts, Fashion, Naturopathy, Pharmacy, Education and Paramedical Sciences.`;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: defaultDescription,
  keywords: [
    "GBTE",
    "Gautam Buddha Technical Education Group",
    "D Pharma",
    "D.El.Ed",
    "BTC",
    "DMLT",
    "X-Ray Technician",
    "OT Technician",
    "Artificial Intelligence diploma",
    "Generative AI diploma",
    "Machine Learning diploma",
    "Data Science diploma",
    "Culinary Arts diploma",
    "Fashion Design diploma",
    "Naturopathy diploma",
    "Makeup diploma",
    "Psychology diploma",
    "admissions 2027",
    "Noida college",
  ],
  authors: [{ name: SITE.fullName }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: "hi_IN",
    url: SITE.url,
    siteName: SITE.fullName,
    title: defaultTitle,
    description: defaultDescription,
    images: [{ url: "/logo.png", width: 500, height: 500, alt: SITE.trust }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/logo.png"],
  },
};

export function pageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const url = path;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description,
      url,
      siteName: SITE.fullName,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
