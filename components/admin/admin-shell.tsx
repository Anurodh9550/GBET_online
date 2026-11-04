"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenCheck,
  CalendarRange,
  ClipboardList,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  UserCog,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAdminSession } from "@/components/admin/admin-session";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

const NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Admissions",
    items: [
      { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
      { href: "/admin/students", label: "Students", icon: Users },
    ],
  },
  {
    title: "Academics",
    items: [
      {
        href: "/admin/courses",
        label: "Courses & Content",
        icon: BookOpenCheck,
      },
      { href: "/admin/batches", label: "Batches", icon: CalendarRange },
      { href: "/admin/enrollments", label: "Enrolments", icon: GraduationCap },
      { href: "/admin/faculty", label: "Faculty", icon: UserCog, soon: true },
      {
        href: "/admin/academic",
        label: "Assignments & Exams",
        icon: ClipboardList,
        soon: true,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        href: "/admin/finance",
        label: "Finance",
        icon: IndianRupee,
      },
      { href: "/admin/reports", label: "Reports", icon: BarChart3, soon: true },
    ],
  },
  {
    title: "Website",
    items: [{ href: "/admin/news", label: "News & Events", icon: Newspaper }],
  },
];

function active(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function Sidebar({
  onNavigate,
  onSignOut,
}: {
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-3 px-6 py-5"
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
          <span className="text-xs text-white/60">Admin Panel</span>
        </span>
      </Link>
      <nav
        aria-label="Admin"
        className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-3 pb-4"
      >
        {NAV.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, soon }) => {
                const isActive = active(pathname, href);
                if (soon) {
                  return (
                    <li key={href}>
                      <span
                        className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/40"
                        aria-disabled="true"
                      >
                        <Icon className="size-[18px]" aria-hidden />
                        <span className="flex-1">{label}</span>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold">
                          Soon
                        </span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-white text-ink"
                          : "text-white/75 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn("size-[18px]", isActive && "text-azure")}
                        aria-hidden
                      />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/admin/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-white/60 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4" aria-hidden />
          Django admin (advanced)
        </a>
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-[18px]" aria-hidden />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { expire } = useAdminSession();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const current = NAV.flatMap((group) => group.items).find((item) =>
    active(pathname, item.href),
  );

  return (
    <div className="min-h-dvh bg-mist text-ink">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar onSignOut={expire} />
      </aside>
      {drawer ? (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
          />
          <div className="absolute inset-y-0 left-0 w-[min(17rem,85vw)]">
            <Sidebar onNavigate={() => setDrawer(false)} onSignOut={expire} />
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="absolute top-5 -right-12 grid size-10 place-items-center rounded-full bg-white"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="grid size-10 place-items-center rounded-xl border border-line lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <p className="flex-1 truncate font-semibold">
            {current?.label ?? "Admin"}
          </p>
          <Link
            href="/"
            className="hidden text-sm font-semibold text-ink-soft hover:text-azure sm:block"
          >
            View website
          </Link>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
