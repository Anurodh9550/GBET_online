import Image from "next/image";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <a
      href={SITE.campusUrl}
      className={cn("flex items-center gap-2.5", className)}
      aria-label="Gautam Buddha Educational Trust campus site"
    >
      <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-[#fcfaf7] ring-2 ring-brand shadow-md">
        <Image
          src="/logo.png"
          alt="Gautam Buddha Educational Trust"
          fill
          className="object-cover"
          sizes="48px"
          priority
        />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className={cn("text-lg font-bold tracking-tight", light ? "text-white" : "text-navy")}>
          GBET
        </span>
        <span
          className={cn(
            "hidden text-[11px] font-medium sm:block",
            light ? "text-slate-300" : "text-slate-500"
          )}
        >
          Gautam Buddha Educational Trust
        </span>
      </span>
    </a>
  );
}
