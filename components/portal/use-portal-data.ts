"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PortalError, portalRequest } from "@/lib/portal/client";

type State<T> = { data: T | null; error: PortalError | null; loading: boolean };

export function usePortalData<T>(path: string | null) {
  const [state, setState] = useState<State<T>>({
    data: null,
    error: null,
    loading: Boolean(path),
  });
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    portalRequest<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof PortalError && error.status === 401) {
          router.replace(
            `/student/login?expired=1&next=${encodeURIComponent(window.location.pathname)}`,
          );
          return;
        }
        setState({
          data: null,
          error:
            error instanceof PortalError
              ? error
              : new PortalError("Something went wrong.", 0),
          loading: false,
        });
      });
    return () => {
      cancelled = true;
    };
  }, [path, attempt, router]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: null }));
    setAttempt((value) => value + 1);
  }, []);

  const replace = useCallback(
    (data: T) => setState({ data, error: null, loading: false }),
    [],
  );

  return { ...state, reload, replace };
}
