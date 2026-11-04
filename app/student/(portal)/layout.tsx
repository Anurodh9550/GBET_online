import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/portal-shell";
import { StudentSessionProvider } from "@/components/portal/student-session";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: "Student Dashboard",
    template: `%s | ${SITE.name} Student Portal`,
  },
  robots: { index: false, follow: false },
};

export default function StudentPortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StudentSessionProvider>
      <PortalShell>{children}</PortalShell>
    </StudentSessionProvider>
  );
}
