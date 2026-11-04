import { UserRound } from "lucide-react";
import type { FacultyProfile } from "@/lib/course-catalog";

export function FacultyCard({ faculty }: { faculty: FacultyProfile }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-mist text-ink-soft" aria-hidden>
          <UserRound className="size-7" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{faculty.name}</h3>
          <p className="text-sm text-azure">{faculty.role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink-soft">{faculty.bio}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {faculty.expertise.map((item) => (
          <li key={item} className="rounded-full bg-mist px-2.5 py-1 text-xs text-ink">
            {item}
          </li>
        ))}
      </ul>
      {faculty.placeholder ? (
        <p className="mt-auto pt-4 text-xs font-medium text-ink-soft">Profile to be announced</p>
      ) : null}
    </article>
  );
}
