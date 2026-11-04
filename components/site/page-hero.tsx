import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  intro,
  crumb,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  crumb: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-azure-soft/70 to-white">
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-10 sm:px-6 sm:pt-10 sm:pb-12">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-azure">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="font-medium text-ink">
              {crumb}
            </li>
          </ol>
        </nav>
        <p className="mt-6 text-xs font-bold tracking-[0.16em] text-azure uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[2.1rem] leading-tight font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
          {intro}
        </p>
        {children}
      </div>
    </section>
  );
}
