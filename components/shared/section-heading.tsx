import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div className={cn(align === "left" ? "max-w-3xl text-left" : "mx-auto max-w-3xl text-center", className)}>
      {eyebrow ? (
        <p className={cn("mb-3 text-xs font-semibold tracking-[0.22em] uppercase", light ? "text-[#ffb089]" : "text-brand")}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-3xl font-bold tracking-tight sm:text-4xl", light ? "text-white" : "text-navy")}>
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mt-3 text-base leading-7", light ? "text-slate-300" : "text-slate-600")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
