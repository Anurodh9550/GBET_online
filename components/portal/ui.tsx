import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  percent,
  label,
  className,
}: {
  percent: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-mist", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div
        className="h-full rounded-full bg-azure transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-azure-soft text-azure">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {children ? (
        <div className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-soft">
          {children}
        </div>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-azure px-5 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="rounded-3xl border border-line bg-white p-8 text-center"
    >
      <AlertTriangle className="mx-auto size-8 text-amber-500" aria-hidden />
      <p className="mt-3 font-semibold">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-azure px-5 text-sm font-semibold text-white hover:bg-azure-dark"
        >
          <RefreshCw className="size-4" aria-hidden />
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function CardSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-4", className)}
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
      ))}
    </div>
  );
}
