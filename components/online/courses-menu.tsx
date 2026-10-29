"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useI18n } from "@/components/providers/language-provider";
import { CATEGORIES, ONLINE_COURSES, courseKind } from "@/lib/courses";
import { cn } from "@/lib/utils";

const GROUPS = CATEGORIES.filter((category) => category.id !== "all")
  .map((category) => ({ category, items: ONLINE_COURSES.filter((course) => course.category === category.id) }))
  .filter((group) => group.items.length > 0);

const DIPLOMAS = ONLINE_COURSES.filter((course) => courseKind(course) === "diploma").length;
const CERTIFICATES = ONLINE_COURSES.filter((course) => courseKind(course) === "certificate").length;

export function CoursesMenu({ active = false, onBrochure }: { active?: boolean; onBrochure?: () => void }) {
  const { locale } = useI18n();
  const hi = locale === "hi";
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  const show = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(
    () => () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <>
      <Link
        href="/courses"
        className={cn("inline-flex items-center gap-1 transition hover:text-brand", (open || active) && "text-brand")}
        aria-haspopup="true"
        aria-expanded={open}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
      >
        {hi ? "कोर्स" : "Courses"}
        <ChevronDown className={cn("size-4 transition", open && "rotate-180")} />
      </Link>

      <div
        className={cn(
          "absolute inset-x-0 top-full hidden px-4 pt-3 transition duration-200 sm:px-6 lg:block",
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[17rem_1fr] overflow-hidden rounded-3xl border border-[#ebe4dc] bg-white text-[#3d2918] shadow-[0_28px_60px_-24px_rgba(61,41,24,0.4)]">
          <aside className="flex flex-col bg-[#3d2918] p-7 text-white">
            <p className="text-[11px] font-bold tracking-[0.18em] text-brand uppercase">GBET Online</p>
            <p className="mt-3 font-serif text-3xl leading-tight">
              {hi ? `${ONLINE_COURSES.length} ऑनलाइन कोर्स` : `${ONLINE_COURSES.length} online programmes`}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {hi
                ? "रिकॉर्डेड पाठ, लाइव सेशन और नोएडा काउंसलिंग डेस्क।"
                : "Recorded lessons, live sessions and a Noida counselling desk."}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                [DIPLOMAS, hi ? "डिप्लोमा" : "Diplomas"],
                [CERTIFICATES, hi ? "सर्टिफिकेट" : "Certificates"],
              ].map(([count, label]) => (
                <div key={String(label)} className="rounded-2xl bg-white/10 px-3 py-3">
                  <p className="font-serif text-2xl text-brand">{count}</p>
                  <p className="text-xs text-white/70">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto grid gap-2 pt-7">
              <Link
                href="/courses"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white hover:bg-brand/90"
              >
                {hi ? "सभी कोर्स देखें" : "View all courses"} <ArrowRight className="size-4" />
              </Link>
              {onBrochure ? (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onBrochure();
                  }}
                  className="h-11 rounded-full border border-white/25 text-sm font-semibold text-white hover:bg-white/10"
                >
                  {hi ? "ब्रोशर डाउनलोड" : "Download brochure"}
                </button>
              ) : null}
            </div>
          </aside>

          <div className="p-7">
            <div className="flex items-baseline justify-between border-b border-[#ebe4dc] pb-4">
              <p className="text-sm font-semibold">{hi ? "क्षेत्र के अनुसार कोर्स" : "Browse by area"}</p>
              <p className="text-xs text-stone-500">{hi ? "अवधि हर कोर्स के साथ" : "Duration shown with each course"}</p>
            </div>
            <div className="mt-5 columns-3 gap-x-8">
              {GROUPS.map(({ category, items }) => (
                <div key={category.id} className="mb-6 break-inside-avoid">
                  <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-brand uppercase">
                    {hi ? category.labelHi : category.label}
                    <span className="rounded-full bg-[#f6f1eb] px-1.5 py-0.5 text-[10px] tracking-normal text-stone-500">{items.length}</span>
                  </p>
                  <ul className="mt-2">
                    {items.map((course) => (
                      <li key={course.slug}>
                        <Link
                          href={`/courses/${course.slug}`}
                          onClick={() => setOpen(false)}
                          className="group -mx-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-[#fcfaf7]"
                        >
                          <span className="font-medium group-hover:text-brand">{hi ? course.nameHi : course.shortName}</span>
                          <span className="shrink-0 text-xs text-stone-400 group-hover:text-stone-600">
                            {hi ? course.durationHi : course.duration}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
