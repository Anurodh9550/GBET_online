"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Check, Download, Scale, X } from "lucide-react";
import { SelectInput } from "@/components/portal/form-controls";
import { EmptyState } from "@/components/portal/ui";
import {
  CATALOG,
  getCatalogCourse,
  type CatalogCourse,
} from "@/lib/course-catalog";

const MAX = 3;

function Row({
  label,
  courses,
  render,
}: {
  label: string;
  courses: CatalogCourse[];
  render: (course: CatalogCourse) => ReactNode;
}) {
  return (
    <tr className="align-top">
      <th
        scope="row"
        className="w-40 bg-mist px-4 py-4 text-left text-xs font-bold tracking-wide text-ink-soft uppercase"
      >
        {label}
      </th>
      {courses.map((course) => (
        <td key={course.slug} className="px-4 py-4 text-sm">
          {render(course)}
        </td>
      ))}
    </tr>
  );
}

export function CompareView() {
  const params = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() =>
    (params.get("courses") ?? "")
      .split(",")
      .filter((slug) => getCatalogCourse(slug))
      .slice(0, MAX),
  );

  useEffect(() => {
    const url = selected.length
      ? `?courses=${selected.join(",")}`
      : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [selected]);

  const courses = selected
    .map((slug) => getCatalogCourse(slug))
    .filter((course): course is CatalogCourse => Boolean(course));
  const options = CATALOG.filter((course) => !selected.includes(course.slug));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {courses.map((course) => (
          <span
            key={course.slug}
            className="inline-flex items-center gap-2 rounded-full bg-azure-soft py-1.5 pr-2 pl-4 text-sm font-semibold text-azure-dark"
          >
            {course.shortTitle}
            <button
              type="button"
              onClick={() =>
                setSelected(selected.filter((slug) => slug !== course.slug))
              }
              className="grid size-6 place-items-center rounded-full hover:bg-white"
              aria-label={`Remove ${course.title}`}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {selected.length < MAX ? (
          <SelectInput
            aria-label="Add a course to compare"
            value=""
            onChange={(event) =>
              event.target.value &&
              setSelected([...selected, event.target.value])
            }
            className="h-10 w-auto min-w-64"
          >
            <option value="">
              {selected.length
                ? "+ Add another course"
                : "+ Choose a course to compare"}
            </option>
            {options.map((course) => (
              <option key={course.slug} value={course.slug}>
                {course.title}
              </option>
            ))}
          </SelectInput>
        ) : (
          <span className="text-sm text-ink-soft">
            Up to {MAX} courses at a time.
          </span>
        )}
      </div>

      {courses.length < 2 ? (
        <EmptyState
          icon={Scale}
          title={
            courses.length ? "Add one more course" : "Choose courses to compare"
          }
        >
          Pick two or three courses to see their duration, eligibility, modules
          and career areas side by side.
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-line bg-white">
          <table
            className={`w-full text-left ${courses.length === 3 ? "min-w-[56rem]" : "min-w-[40rem]"}`}
          >
            <thead>
              <tr>
                <td className="w-40 bg-mist" />
                {courses.map((course) => (
                  <th
                    key={course.slug}
                    scope="col"
                    className="px-4 pt-4 pb-3 text-left align-top"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-mist">
                      <Image
                        src={course.thumbnail}
                        alt=""
                        fill
                        sizes="300px"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-azure">
                      {course.categoryLabel}
                    </p>
                    <p className="text-base leading-snug font-bold">
                      {course.title}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              <Row
                label="Programme"
                courses={courses}
                render={(course) => course.programmeType}
              />
              <Row
                label="Duration"
                courses={courses}
                render={(course) => course.duration}
              />
              <Row
                label="Eligibility"
                courses={courses}
                render={(course) => course.eligibility}
              />
              <Row
                label="Mode"
                courses={courses}
                render={() => "Online – recorded lessons + live sessions"}
              />
              <Row
                label="Modules"
                courses={courses}
                render={(course) => (
                  <ol className="space-y-1">
                    {course.curriculum.map((module) => (
                      <li key={module.number}>
                        <span className="font-semibold text-azure">
                          {module.number}.
                        </span>{" "}
                        {module.title}
                      </li>
                    ))}
                  </ol>
                )}
              />
              <Row
                label="You will learn to"
                courses={courses}
                render={(course) => (
                  <ul className="space-y-1.5">
                    {course.learningOutcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-2">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-azure"
                          aria-hidden
                        />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                )}
              />
              <Row
                label="Career areas"
                courses={courses}
                render={(course) => (
                  <div className="flex flex-wrap gap-1.5">
                    {course.careerOpportunities.map((career) => (
                      <span
                        key={career.role}
                        className="rounded-full bg-mist px-2.5 py-1 text-xs"
                      >
                        {career.role}
                      </span>
                    ))}
                  </div>
                )}
              />
              <Row
                label="Fees"
                courses={courses}
                render={() => (
                  <span className="text-ink-soft">
                    Shared during counselling
                  </span>
                )}
              />
              <Row
                label=""
                courses={courses}
                render={(course) => (
                  <div className="grid gap-2">
                    <Link
                      href={`/apply?course=${course.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-azure text-sm font-semibold text-white hover:bg-azure-dark"
                    >
                      Apply
                    </Link>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-line text-sm font-semibold hover:border-azure"
                    >
                      Course details
                    </Link>
                    <a
                      href={`/brochures/${course.slug}.pdf`}
                      download
                      className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-semibold text-azure hover:text-azure-dark"
                    >
                      <Download className="size-4" aria-hidden />
                      Brochure
                    </a>
                  </div>
                )}
              />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
