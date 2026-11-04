"use client";

import { AdminStudents } from "@/components/admin/admin-students";
import { useAdminSession } from "@/components/admin/admin-session";
import { PageHeader } from "@/components/portal/ui";

export function StudentsPage() {
  const { token, expire } = useAdminSession();
  return (
    <div>
      <PageHeader
        title="Students"
        description="Verify admission requests, add students, assign courses and manage portal access."
      />
      <AdminStudents token={token} onUnauthorized={expire} />
    </div>
  );
}
