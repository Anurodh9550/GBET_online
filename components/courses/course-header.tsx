"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrochureDialog } from "@/components/online/brochure-dialog";
import { CoursesMenu } from "@/components/online/courses-menu";
import { COURSE_CATEGORIES } from "@/lib/course-catalog";
import { SITE } from "@/lib/site";

export function CourseHeader({ courseTitle }: { courseTitle?: string }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const close = () => setMenu(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 text-ink backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE.name} home`}>
          <span className="relative size-11 overflow-hidden rounded-full ring-2 ring-azure/30">
            <Image src="/logo.png" alt="" fill className="object-cover" sizes="44px" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold">{SITE.name}</span>
            <span className="hidden text-[11px] text-ink-soft sm:block">{SITE.trust}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 text-sm font-semibold lg:flex">
          <Link href="/" className="transition hover:text-azure">
            Home
          </Link>
          <CoursesMenu active tone="navy" onBrochure={() => setBrochureOpen(true)} />
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={pathname === "/contact" ? "text-azure" : "transition hover:text-azure"}
          >
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/student/login" className="px-3 py-2 text-sm font-semibold transition hover:text-azure">
            Login
          </Link>
          <a href="#enquiry" className="rounded-full bg-azure px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-azure-dark">
            Enquire Now
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
          onClick={() => setMenu((value) => !value)}
          aria-label={menu ? "Close menu" : "Open menu"}
          aria-expanded={menu}
          aria-controls="course-mobile-menu"
        >
          {menu ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menu ? (
        <nav id="course-mobile-menu" aria-label="Mobile" className="max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-line bg-white px-4 pb-6 lg:hidden">
          <ul className="divide-y divide-line text-sm font-semibold">
            <li>
              <Link href="/" onClick={close} className="block py-3">
                Home
              </Link>
            </li>
            <li>
              <Link href="/courses" onClick={close} className="block py-3">
                All courses
              </Link>
            </li>
            <li>
              <Link href="/contact" onClick={close} className="block py-3">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/student/login" onClick={close} className="block py-3">
                Login
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-[11px] font-bold tracking-[0.14em] text-azure uppercase">Browse by area</p>
          <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {COURSE_CATEGORIES.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/courses?category=${category.id}`}
                  onClick={close}
                  className="block rounded-xl border border-line px-3 py-2.5 font-medium hover:border-azure hover:text-azure"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="#enquiry"
            onClick={close}
            className="mt-5 flex h-12 items-center justify-center rounded-full bg-azure text-sm font-semibold text-white"
          >
            Enquire Now
          </a>
        </nav>
      ) : null}

      <BrochureDialog open={brochureOpen} onClose={() => setBrochureOpen(false)} defaultCourse={courseTitle} />
    </header>
  );
}
