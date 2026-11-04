"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { AdminError, adminRequest } from "@/lib/admin/api";
import { ADMIN_TOKEN_KEY } from "@/lib/api";

const TOKEN_EVENT = "gbet-admin-token";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(TOKEN_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TOKEN_EVENT, callback);
  };
}

export function setAdminToken(token: string | null) {
  if (token) window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_EVENT));
}

export function useAdminToken() {
  return useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem(ADMIN_TOKEN_KEY),
    () => undefined,
  );
}

type Session = { token: string; expire: () => void };
const SessionContext = createContext<Session | null>(null);

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAdminToken();

  useEffect(() => {
    if (token === null) router.replace("/admin/login");
  }, [token, router]);

  const expire = useCallback(() => {
    setAdminToken(null);
    router.replace("/admin/login");
  }, [router]);

  if (!token) {
    return (
      <p className="px-6 py-20 text-center text-sm text-ink-soft">
        Opening the admin panel…
      </p>
    );
  }
  return (
    <SessionContext.Provider value={{ token, expire }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useAdminSession() {
  const session = useContext(SessionContext);
  if (!session)
    throw new Error("useAdminSession must be used inside AdminSessionProvider");
  return session;
}

export function useAdminData<T>(path: string | null) {
  const { token, expire } = useAdminSession();
  const [state, setState] = useState<{
    path: string | null;
    data: T | null;
    error: AdminError | null;
  }>({
    path: null,
    data: null,
    error: null,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    adminRequest<T>(token, path)
      .then((data) => !cancelled && setState({ path, data, error: null }))
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof AdminError && error.status === 401)
          return expire();
        setState({
          path,
          data: null,
          error:
            error instanceof AdminError
              ? error
              : new AdminError("Could not load.", 0),
        });
      });
    return () => {
      cancelled = true;
    };
  }, [path, token, attempt, expire]);

  const fresh = state.path === path;
  return {
    data: fresh ? state.data : null,
    error: fresh ? state.error : null,
    loading: Boolean(path) && !fresh,
    reload: () => setAttempt((value) => value + 1),
    replace: (data: T) => setState({ path, data, error: null }),
  };
}
