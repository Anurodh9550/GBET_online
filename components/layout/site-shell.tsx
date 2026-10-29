"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const desk = pathname.startsWith("/admin");

  return (
    <>
      <main id="main" className="flex-1">
        {children}
      </main>
      {desk ? null : <Footer />}
    </>
  );
}
