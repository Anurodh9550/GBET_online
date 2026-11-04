import type { Metadata } from "next";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { CATALOG } from "@/lib/course-catalog";

export const metadata: Metadata = {
  title: "Course Brochures",
  robots: { index: false, follow: false },
};

export default function BrochureIndexPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 text-ink">
      <h1 className="text-2xl font-bold">Course brochures</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Print-ready A4 brochures for every course. Regenerate the PDFs with{" "}
        <code>npm run brochures</code> after changing course content.
      </p>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line bg-white">
        {CATALOG.map((course) => (
          <li
            key={course.slug}
            className="flex items-center gap-3 px-4 py-3 text-sm"
          >
            <span className="flex-1 font-medium">{course.title}</span>
            <Link
              href={`/brochures/${course.slug}`}
              data-slug={course.slug}
              className="inline-flex items-center gap-1.5 font-semibold text-azure"
            >
              <Eye className="size-4" aria-hidden />
              Preview
            </Link>
            <a
              href={`/brochures/${course.slug}.pdf`}
              download
              className="inline-flex items-center gap-1.5 font-semibold text-azure"
            >
              <Download className="size-4" aria-hidden />
              PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
