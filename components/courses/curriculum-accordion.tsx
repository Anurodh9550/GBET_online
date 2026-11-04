"use client";

import { useId, useState } from "react";
import { ChevronDown, Target } from "lucide-react";
import type { CurriculumModule } from "@/lib/course-catalog";
import { cn } from "@/lib/utils";

export function CurriculumAccordion({ modules }: { modules: CurriculumModule[] }) {
  const uid = useId();
  const [open, setOpen] = useState<number[]>(modules.length ? [modules[0].number] : []);
  const allOpen = open.length === modules.length;

  const toggle = (number: number) =>
    setOpen((current) => (current.includes(number) ? current.filter((item) => item !== number) : [...current, number]));

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? [] : modules.map((module) => module.number))}
          className="text-sm font-semibold text-azure hover:text-azure-dark"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <ol className="mt-3 space-y-3">
        {modules.map((module) => {
          const isOpen = open.includes(module.number);
          const panelId = `${uid}-panel-${module.number}`;
          const buttonId = `${uid}-button-${module.number}`;
          return (
            <li key={module.number} className={cn("overflow-hidden rounded-2xl border bg-white transition", isOpen ? "border-azure/40 shadow-sm" : "border-line")}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggle(module.number)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left sm:px-5"
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold transition",
                      isOpen ? "bg-azure text-white" : "bg-mist text-ink",
                    )}
                  >
                    {String(module.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-ink-soft">Module {module.number}</span>
                    <span className="block font-semibold text-ink sm:text-lg">{module.title}</span>
                  </span>
                  <span className="hidden text-xs text-ink-soft sm:block">{module.topics.length} topics</span>
                  <ChevronDown className={cn("size-5 shrink-0 text-ink-soft transition", isOpen && "rotate-180 text-azure")} aria-hidden />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="border-t border-line px-4 pt-4 pb-5 sm:px-5">
                <p className="text-[11px] font-bold tracking-[0.12em] text-ink uppercase">Topics covered</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {module.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-2 rounded-xl bg-mist px-3 py-2.5 text-sm text-ink">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-azure" aria-hidden />
                      {topic}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-azure/20 bg-azure-soft/60 p-3.5">
                  <Target className="mt-0.5 size-4 shrink-0 text-azure" aria-hidden />
                  <p className="text-sm text-ink">
                    <span className="font-semibold">Learning outcome: </span>
                    {module.outcome}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
