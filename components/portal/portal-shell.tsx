"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, LogOut, Menu, RefreshCw, X } from "lucide-react";
import { useStudentSession } from "@/components/portal/student-session";
import { PORTAL_SECTIONS } from "@/lib/portal/navigation";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isActive(pathname: string, href: string) {
  return href === "/student"
    ? pathname === "/student"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({
  onNavigate,
  onLogout,
}: {
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <Link
        href="/student"
        onClick={onNavigate}
        className="flex items-center gap-3 px-6 py-5"
        aria-label="Student portal home"
      >
        <span className="relative size-10 overflow-hidden rounded-full ring-2 ring-white/25">
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-cover"
            sizes="40px"
          />
        </span>
        <span className="leading-tight">
          <span className="block font-bold">{SITE.name}</span>
          <span className="text-xs text-white/60">Student Portal</span>
        </span>
      </Link>
      <nav
        aria-label="Student portal"
        className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4"
      >
        <ul className="space-y-0.5">
          {PORTAL_SECTIONS.map(({ href, label, icon: Icon, ready }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-white text-ink"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0",
                      active ? "text-azure" : "",
                    )}
                    aria-hidden
                  />
                  <span className="flex-1">{label}</span>
                  {!ready ? (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        active
                          ? "bg-azure-soft text-azure-dark"
                          : "bg-white/10 text-white/60",
                      )}
                    >
                      Soon
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-[18px]" aria-hidden />
          Log out
        </button>
      </div>
    </div>
  );
}

function ShellLoading() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading your account"
    >
      <div className="h-32 animate-pulse rounded-3xl bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
    </div>
  );
}

export function PortalShell({ children }: { children: ReactNode }) {
  const { student, error, retry, logout } = useStudentSession();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [leaving, setLeaving] = useState(false);

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

  const section = PORTAL_SECTIONS.find((item) => isActive(pathname, item.href));

  async function handleLogout() {
    setDrawer(false);
    setLeaving(true);
    await logout();
  }

  return (
    <div className="min-h-dvh bg-mist text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar onLogout={handleLogout} />
      </aside>

      {drawer ? (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Portal menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] shadow-2xl">
            <Sidebar
              onNavigate={() => setDrawer(false)}
              onLogout={handleLogout}
            />
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="absolute top-5 -right-12 grid size-10 place-items-center rounded-full bg-white text-ink"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="grid size-10 place-items-center rounded-xl border border-line lg:hidden"
              aria-label="Open menu"
              aria-expanded={drawer}
            >
              <Menu className="size-5" />
            </button>
            <p className="min-w-0 flex-1 truncate font-semibold">
              {section?.label ?? "Student Portal"}
            </p>
            {student ? (
              <div className="flex items-center gap-3">
                <div className="hidden text-right leading-tight sm:block">
                  <p className="text-sm font-semibold">{student.full_name}</p>
                  <p className="text-xs text-ink-soft">
                    {student.student_id ?? "Student"}
                  </p>
                </div>
                <Link
                  href="/student/profile"
                  className="grid size-10 place-items-center rounded-full bg-azure text-sm font-bold text-white"
                  aria-label="My profile"
                >
                  {initials(student.full_name)}
                </Link>
              </div>
            ) : null}
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {leaving ? (
            <p className="py-20 text-center text-sm text-ink-soft">
              Logging you out…
            </p>
          ) : error ? (
            <div
              role="alert"
              className="rounded-3xl border border-line bg-white p-8 text-center"
            >
              <AlertTriangle
                className="mx-auto size-8 text-amber-500"
                aria-hidden
              />
              <h1 className="mt-3 text-lg font-semibold">
                We could not load your account
              </h1>
              <p className="mt-1 text-sm text-ink-soft">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-azure px-5 text-sm font-semibold text-white hover:bg-azure-dark"
              >
                <RefreshCw className="size-4" aria-hidden />
                Try again
              </button>
            </div>
          ) : student ? (
            children
          ) : (
            <ShellLoading />
          )}
        </div>
      </div>
    </div>
  );
}
