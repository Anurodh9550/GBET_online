import { BriefcaseBusiness, Info } from "lucide-react";
import type { CareerOpportunity } from "@/lib/course-catalog";

export function CareerSection({ careers, courseTitle }: { careers: CareerOpportunity[]; courseTitle: string }) {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {careers.map((career) => (
          <li key={career.role} className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
            <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-sky-300">
              <BriefcaseBusiness className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 font-semibold text-white">{career.role}</h3>
            <p className="mt-1.5 text-sm leading-6 text-white/70">{career.focus}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex items-start gap-2 text-sm text-white/70">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        These are roles that skills from the {courseTitle} are relevant to. Career outcomes depend on individual effort, experience and
        the job market, and placement is not guaranteed.
      </p>
    </div>
  );
}
