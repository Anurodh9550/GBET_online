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

type MenuTone = "warm" | "navy";

const TONES: Record<MenuTone, Record<string, string>> = {
  warm: {
    trigger: "hover:text-brand",
    triggerOn: "text-brand",
    panel: "border-[#ebe4dc] text-[#3d2918] shadow-[0_28px_60px_-24px_rgba(61,41,24,0.4)]",
    aside: "bg-[#3d2918]",
    asideAccent: "text-brand",
    cta: "bg-brand hover:bg-brand/90",
    divider: "border-[#ebe4dc]",
    heading: "text-brand hover:opacity-80",
    chip: "bg-[#f6f1eb]",
    row: "hover:bg-[#fcfaf7]",
    rowText: "group-hover:text-brand",
  },
  navy: {
    trigger: "hover:text-azure",
    triggerOn: "text-azure",
    panel: "border-line text-ink shadow-[0_28px_60px_-24px_rgba(11,31,58,0.35)]",
    aside: "bg-ink",
    asideAccent: "text-sky-300",
    cta: "bg-azure hover:bg-azure-dark",
    divider: "border-line",
    heading: "text-azure hover:text-azure-dark",
    chip: "bg-mist",
    row: "hover:bg-mist",
    rowText: "group-hover:text-azure",
  },
};

const DIPLOMAS = ONLINE_COURSES.filter((course) => courseKind(course) === "diploma").length;
const CERTIFICATES = ONLINE_COURSES.filter((course) => courseKind(course) === "certificate").length;

export function CoursesMenu({
  active = false,
  onBrochure,
  tone = "warm",
}: {
  active?: boolean;
  onBrochure?: () => void;
  tone?: MenuTone;
}) {
  const s = TONES[tone];
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
        className={cn("inline-flex items-center gap-1 transition", s.trigger, (open || active) && s.triggerOn)}
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
        <div className={cn("mx-auto grid max-w-7xl grid-cols-[17rem_1fr] overflow-hidden rounded-3xl border bg-white", s.panel)}>
          <aside className={cn("flex flex-col p-7 text-white", s.aside)}>
            <p className={cn("text-[11px] font-bold tracking-[0.18em] uppercase", s.asideAccent)}>GBET Online</p>
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
                  <p className={cn("font-serif text-2xl", s.asideAccent)}>{count}</p>
                  <p className="text-xs text-white/70">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-auto grid gap-2 pt-7">
              <Link
                href="/courses"
                onClick={() => setOpen(false)}
                className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white", s.cta)}
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
            <div className={cn("flex items-baseline justify-between border-b pb-4", s.divider)}>
              <p className="text-sm font-semibold">{hi ? "क्षेत्र के अनुसार कोर्स" : "Browse by area"}</p>
              <p className="text-xs text-stone-500">{hi ? "अवधि हर कोर्स के साथ" : "Duration shown with each course"}</p>
            </div>
            <div className="mt-5 columns-3 gap-x-8">
              {GROUPS.map(({ category, items }) => (
                <div key={category.id} className="mb-6 break-inside-avoid">
                  <Link
                    href={`/courses?category=${category.id}`}
                    onClick={() => setOpen(false)}
                    className={cn("flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase", s.heading)}
                  >
                    {hi ? category.labelHi : category.label}
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] tracking-normal text-stone-500", s.chip)}>{items.length}</span>
                  </Link>
                  <ul className="mt-2">
                    {items.map((course) => (
                      <li key={course.slug}>
                        <Link
                          href={`/courses/${course.slug}`}
                          onClick={() => setOpen(false)}
                          className={cn("group -mx-3 flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition", s.row)}
                        >
                          <span className={cn("font-medium", s.rowText)}>{hi ? course.nameHi : course.shortName}</span>
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
