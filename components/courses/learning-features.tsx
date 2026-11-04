import { BookOpenText, ClipboardCheck, FolderKanban, NotebookPen, PlayCircle, Video, type LucideIcon } from "lucide-react";
import type { LearningFeature } from "@/lib/course-catalog";

const ICONS: Record<LearningFeature["id"], LucideIcon> = {
  recorded: PlayCircle,
  live: Video,
  assignments: NotebookPen,
  material: BookOpenText,
  projects: FolderKanban,
  assessments: ClipboardCheck,
};

export function LearningFeatures({ features }: { features: LearningFeature[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {features.map((feature) => {
        const Icon = ICONS[feature.id];
        return (
          <li key={feature.id} className="flex gap-4 rounded-2xl border border-line bg-white p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-azure-soft text-azure">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-semibold text-ink">{feature.title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink-soft">{feature.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
