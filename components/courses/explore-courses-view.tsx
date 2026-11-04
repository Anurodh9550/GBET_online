"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { AdmissionEnquiryForm } from "@/components/courses/admission-enquiry-form";
import {
  CourseFilters,
  EMPTY_FILTERS,
  countActiveFilters,
  type CourseFilterState,
} from "@/components/courses/course-filters";
import { CourseGrid } from "@/components/courses/course-grid";
import { CourseHeader } from "@/components/courses/course-header";
import { CourseSearch } from "@/components/courses/course-search";
import { DownloadBrochureButton } from "@/components/courses/download-brochure-button";
import { PhotoPanel } from "@/components/courses/photo-panel";
import {
  CATALOG,
  CATEGORY_ORDER,
  COURSE_CATEGORIES,
  DURATIONS,
  PROGRAMME_TYPES,
  type CatalogCourse,
  type ProgrammeType,
} from "@/lib/course-catalog";
import type { CourseCategory } from "@/lib/courses";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type SortKey = "recommended" | "title" | "duration";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "title", label: "Course name (A–Z)" },
  { id: "duration", label: "Duration (shortest first)" },
];

function durationMonths(duration: string) {
  const value = Number.parseInt(duration, 10) || 0;
  return /year/i.test(duration) ? value * 12 : value;
}

function readList<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
) {
  return (params.get(key)?.split(",") ?? []).filter((value): value is T =>
    allowed.includes(value as T),
  );
}

function matches(course: CatalogCourse, query: string) {
  if (!query) return true;
  const haystack =
    `${course.title} ${course.shortTitle} ${course.categoryLabel}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

export function ExploreCoursesView() {
  const params = useSearchParams();
  const [query, setQuery] = useState(() => params.get("q") ?? "");
  const [filters, setFilters] = useState<CourseFilterState>(() => ({
    categories: readList<CourseCategory>(params, "category", CATEGORY_ORDER),
    programmeTypes: readList<ProgrammeType>(params, "type", PROGRAMME_TYPES),
    durations: readList<string>(params, "duration", DURATIONS),
  }));
  const [sort, setSort] = useState<SortKey>("recommended");
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (filters.categories.length)
      next.set("category", filters.categories.join(","));
    if (filters.programmeTypes.length)
      next.set("type", filters.programmeTypes.join(","));
    if (filters.durations.length)
      next.set("duration", filters.durations.join(","));
    const search = next.toString();
    window.history.replaceState(
      null,
      "",
      search ? `?${search}` : window.location.pathname,
    );
  }, [query, filters]);

  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const results = useMemo(() => {
    const list = CATALOG.filter(
      (course) =>
        matches(course, query.trim()) &&
        (filters.categories.length === 0 ||
          filters.categories.includes(course.category)) &&
        (filters.programmeTypes.length === 0 ||
          filters.programmeTypes.includes(course.programmeType)) &&
        (filters.durations.length === 0 ||
          filters.durations.includes(course.duration)),
    );
    if (sort === "title")
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "duration")
      return [...list].sort(
        (a, b) => durationMonths(a.duration) - durationMonths(b.duration),
      );
    return list;
  }, [query, filters, sort]);

  const activeCount = countActiveFilters(filters);
  const clearAll = () => {
    setFilters(EMPTY_FILTERS);
    setQuery("");
  };

  const chips = [
    ...filters.categories.map((id) => ({
      key: `c-${id}`,
      label:
        COURSE_CATEGORIES.find((category) => category.id === id)?.label ?? id,
      remove: () =>
        setFilters({
          ...filters,
          categories: filters.categories.filter((item) => item !== id),
        }),
    })),
    ...filters.programmeTypes.map((type) => ({
      key: `t-${type}`,
      label: type,
      remove: () =>
        setFilters({
          ...filters,
          programmeTypes: filters.programmeTypes.filter(
            (item) => item !== type,
          ),
        }),
    })),
    ...filters.durations.map((duration) => ({
      key: `d-${duration}`,
      label: duration,
      remove: () =>
        setFilters({
          ...filters,
          durations: filters.durations.filter((item) => item !== duration),
        }),
    })),
  ];

  const quickCategory =
    filters.categories.length === 1 ? filters.categories[0] : null;

  return (
    <div className="bg-white text-ink">
      <CourseHeader />

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
                Courses
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-12">
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
                {SITE.name}
              </p>
              <h1 className="mt-2 text-[2.1rem] leading-tight font-bold tracking-tight sm:text-5xl">
                Explore Our Courses
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
                Online diploma and certificate programmes in technology, design,
                media, arts, wellness, hospitality and business, taught through
                recorded lectures and live sessions.
              </p>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
              <div className="mb-3 hidden h-72 grid-cols-[1.25fr_1fr] grid-rows-2 gap-3 lg:grid">
                <PhotoPanel
                  src="/photos/hero-class.jpg"
                  alt="Learners studying together on laptops"
                  className="row-span-2"
                  sizes="25vw"
                />
                <PhotoPanel src="/photos/ai.jpg" alt="" sizes="20vw" />
                <PhotoPanel src="/photos/fashion.jpg" alt="" sizes="20vw" />
              </div>
              <dl className="grid grid-cols-3 gap-3 text-center">
                {[
                  [String(CATALOG.length), "Programmes"],
                  [String(COURSE_CATEGORIES.length), "Study areas"],
                  ["Online", "Delivery"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-line bg-white px-2 py-4"
                  >
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-xl font-bold sm:text-2xl">{value}</dd>
                    <dd className="mt-0.5 text-xs text-ink-soft">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="min-w-0 lg:col-start-1 lg:row-start-2">
              <CourseSearch
                value={query}
                onChange={setQuery}
                className="max-w-3xl"
              />

              <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, categories: [] })}
                  aria-pressed={filters.categories.length === 0}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
                    filters.categories.length === 0
                      ? "bg-ink text-white"
                      : "border border-line bg-white hover:border-azure hover:text-azure",
                  )}
                >
                  All courses
                </button>
                {COURSE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        categories:
                          quickCategory === category.id ? [] : [category.id],
                      })
                    }
                    aria-pressed={filters.categories.includes(category.id)}
                    className={cn(
                      "shrink-0 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
                      filters.categories.includes(category.id)
                        ? "bg-ink text-white"
                        : "border border-line bg-white hover:border-azure hover:text-azure",
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="courses"
        className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[16.5rem_1fr] lg:py-14"
      >
        <aside className="hidden lg:block" aria-label="Course filters">
          <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
            <CourseFilters
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(EMPTY_FILTERS)}
            />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink-soft" aria-live="polite">
              Showing{" "}
              <span className="font-semibold text-ink">{results.length}</span>{" "}
              of {CATALOG.length} courses
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold lg:hidden"
                aria-haspopup="dialog"
              >
                <SlidersHorizontal className="size-4" aria-hidden />
                Filters
                {activeCount > 0 ? (
                  <span className="grid size-5 place-items-center rounded-full bg-azure text-[11px] text-white">
                    {activeCount}
                  </span>
                ) : null}
              </button>
              <label htmlFor="course-sort" className="sr-only">
                Sort courses
              </label>
              <select
                id="course-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="h-10 rounded-full border border-line bg-white px-3 text-sm font-medium outline-none focus:border-azure focus:ring-4 focus:ring-azure/15"
              >
                {SORTS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {chips.length > 0 ? (
            <ul
              className="mt-4 flex flex-wrap items-center gap-2"
              aria-label="Active filters"
            >
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={chip.remove}
                    className="inline-flex items-center gap-1.5 rounded-full bg-azure-soft px-3 py-1.5 text-xs font-semibold text-azure-dark hover:bg-azure/15"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    {chip.label}
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                  className="px-2 text-xs font-semibold text-ink-soft hover:text-ink"
                >
                  Clear filters
                </button>
              </li>
            </ul>
          ) : null}

          <div className="mt-6">
            <CourseGrid courses={results} onClear={clearAll} />
          </div>
        </div>
      </section>

      <section
        id="enquiry"
        className="scroll-mt-20 border-t border-line bg-mist"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-azure uppercase">
              Admissions {SITE.year}
            </p>
            <h2 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">
              Not sure which course fits you?
            </h2>
            <p className="mt-3 max-w-md leading-7 text-ink-soft">
              Send an enquiry and an admissions advisor will call you to talk
              through the courses, eligibility and fees.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Free counselling call",
                "Help choosing between courses",
                "Clear information on eligibility and fees",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-azure" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <DownloadBrochureButton className="mt-8" />
            <PhotoPanel
              src="/photos/computer.jpg"
              alt="Learner using a laptop"
              caption="Free counselling call before you enrol"
              className="mt-8 hidden aspect-[16/10] lg:block"
            />
          </div>
          <AdmissionEnquiryForm />
        </div>
      </section>

      {drawer ? (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter courses"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawer(false)}
            aria-label="Close filters"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-semibold">Filters</p>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="grid size-9 place-items-center rounded-full hover:bg-mist"
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5">
              <CourseFilters
                filters={filters}
                onChange={setFilters}
                onClear={() => setFilters(EMPTY_FILTERS)}
              />
            </div>
            <div className="border-t border-line p-4">
              <button
                type="button"
                onClick={() => setDrawer(false)}
                className="h-12 w-full rounded-full bg-azure text-sm font-semibold text-white"
              >
                Show {results.length}{" "}
                {results.length === 1 ? "course" : "courses"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
