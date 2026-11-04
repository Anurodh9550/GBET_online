"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PortalError, portalRequest, type Student } from "@/lib/portal/client";

type Session = {
  student: Student | null;
  error: string;
  retry: () => void;
  updateStudent: (student: Student) => void;
  logout: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

export function StudentSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    portalRequest<Student>("me")
      .then((data) => {
        if (!cancelled) setStudent(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (
          err instanceof PortalError &&
          (err.status === 401 || err.status === 403)
        ) {
          router.replace(
            `/student/login?expired=1&next=${encodeURIComponent(pathname)}`,
          );
          return;
        }
        setError(
          err instanceof PortalError
            ? err.message
            : "Your account could not be loaded.",
        );
      });
    return () => {
      cancelled = true;
    };
    // Load once per attempt; navigating between portal pages keeps the session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const retry = useCallback(() => {
    setError("");
    setAttempt((value) => value + 1);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/portal/logout", {
      method: "POST",
      credentials: "same-origin",
    }).catch(() => undefined);
    router.replace("/student/login?logout=1");
    router.refresh();
  }, [router]);

  return (
    <SessionContext.Provider
      value={{ student, error, retry, updateStudent: setStudent, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useStudentSession() {
  const session = useContext(SessionContext);
  if (!session)
    throw new Error(
      "useStudentSession must be used inside StudentSessionProvider",
    );
  return session;
}

export function useStudent() {
  const { student } = useStudentSession();
  if (!student) throw new Error("Student is not loaded yet");
  return student;
}
