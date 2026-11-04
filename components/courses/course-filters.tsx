"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import type { CourseCategory } from "@/lib/courses";
import { CATALOG, COURSE_CATEGORIES, DURATIONS, PROGRAMME_TYPES, type ProgrammeType } from "@/lib/course-catalog";
import { cn } from "@/lib/utils";

export type CourseFilterState = {
  categories: CourseCategory[];
  programmeTypes: ProgrammeType[];
  durations: string[];
};

export const EMPTY_FILTERS: CourseFilterState = { categories: [], programmeTypes: [], durations: [] };

export function countActiveFilters(filters: CourseFilterState) {
  return filters.categories.length + filters.programmeTypes.length + filters.durations.length;
}

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterOption({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition hover:bg-mist",
        checked && "bg-azure-soft/60",
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-[5px] border transition peer-focus-visible:ring-4 peer-focus-visible:ring-azure/20",
          checked ? "border-azure bg-azure text-white" : "border-slate-300 bg-white",
        )}
        aria-hidden
      >
        {checked ? <Check className="size-3.5" /> : null}
      </span>
      <span className={cn("flex-1 text-ink", checked && "font-semibold")}>{label}</span>
      <span className="text-xs text-ink-soft">{count}</span>
    </label>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-5">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 p-0 text-[11px] font-bold tracking-[0.14em] text-ink uppercase">{legend}</legend>
        <div className="space-y-0.5">{children}</div>
      </fieldset>
    </div>
  );
}

export function CourseFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: CourseFilterState;
  onChange: (next: CourseFilterState) => void;
  onClear: () => void;
}) {
  const active = countActiveFilters(filters);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Filter courses</h2>
        {active > 0 ? (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-azure hover:text-azure-dark">
            Clear all
          </button>
        ) : null}
      </div>

      <FilterGroup legend="Course category">
        {COURSE_CATEGORIES.map((category) => (
          <FilterOption
            key={category.id}
            label={category.label}
            count={CATALOG.filter((course) => course.category === category.id).length}
            checked={filters.categories.includes(category.id)}
            onChange={() => onChange({ ...filters, categories: toggle(filters.categories, category.id) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Programme type">
        {PROGRAMME_TYPES.map((type) => (
          <FilterOption
            key={type}
            label={type}
            count={CATALOG.filter((course) => course.programmeType === type).length}
            checked={filters.programmeTypes.includes(type)}
            onChange={() => onChange({ ...filters, programmeTypes: toggle(filters.programmeTypes, type) })}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend="Duration">
        {DURATIONS.map((duration) => (
          <FilterOption
            key={duration}
            label={duration}
            count={CATALOG.filter((course) => course.duration === duration).length}
            checked={filters.durations.includes(duration)}
            onChange={() => onChange({ ...filters, durations: toggle(filters.durations, duration) })}
          />
        ))}
      </FilterGroup>
    </div>
  );
}
