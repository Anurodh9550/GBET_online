import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Student Login",
    template: `%s | ${SITE.name} Student Portal`,
  },
  robots: { index: false, follow: false },
};

const POINTS = [
  "Your courses and lessons in one place",
  "Live class links for your batch",
  "Assignments, results and certificates",
];

export default function StudentAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-mist text-ink lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <aside className="relative hidden overflow-hidden bg-ink text-white lg:block">
        <Image
          src="/photos/hero-class.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-25"
          sizes="50vw"
        />
        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label={`${SITE.name} home`}
          >
            <span className="relative size-12 overflow-hidden rounded-full ring-2 ring-white/30">
              <Image
                src="/logo.png"
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-bold">{SITE.name}</span>
              <span className="text-xs text-white/70">Student Portal</span>
            </span>
          </Link>
          <div>
            <h2 className="max-w-md text-4xl leading-tight font-bold">
              Learn online with GBET.
            </h2>
            <ul className="mt-8 space-y-4">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 text-white/85"
                >
                  <CheckCircle2
                    className="size-5 shrink-0 text-sky-300"
                    aria-hidden
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-white/60">
            Need help? Call {SITE.phone} or email {SITE.email}
          </p>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 lg:invisible"
            aria-label={`${SITE.name} home`}
          >
            <span className="relative size-10 overflow-hidden rounded-full ring-2 ring-azure/30">
              <Image
                src="/logo.png"
                alt=""
                fill
                className="object-cover"
                sizes="40px"
              />
            </span>
            <span className="text-base font-bold">{SITE.name}</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-azure"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to website
          </Link>
        </div>
        <div className="flex flex-1 items-start justify-center px-5 pt-4 pb-12 sm:items-center sm:px-8">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}
