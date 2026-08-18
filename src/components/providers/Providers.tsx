"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { CustomCursor } from "@/components/animation/CustomCursor";

const INTRO_SESSION_KEY = "sierralink-intro-complete";

interface ProvidersContextValue {
  reducedMotion: boolean;
  introComplete: boolean;
  introEnabled: boolean;
  setIntroComplete: (complete: boolean) => void;
  scrollLocked: boolean;
  setScrollLocked: (locked: boolean) => void;
}

const ProvidersContext = createContext<ProvidersContextValue | null>(null);

export function useProviders() {
  const ctx = useContext(ProvidersContext);
  if (!ctx) {
    throw new Error("useProviders must be used within Providers");
  }
  return ctx;
}

interface ProvidersProps {
  children: ReactNode;
  introEnabled?: boolean;
}

export function Providers({ children, introEnabled = true }: ProvidersProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [introComplete, setIntroCompleteState] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);

    const alreadySeen = sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
    if (alreadySeen || !introEnabled) {
      setIntroCompleteState(true);
    }

    return () => mq.removeEventListener("change", handler);
  }, [introEnabled]);

  const setIntroComplete = useCallback((complete: boolean) => {
    setIntroCompleteState(complete);
    if (complete) {
      sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (scrollLocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [scrollLocked, mounted]);

  const value = useMemo(
    () => ({
      reducedMotion,
      introComplete,
      introEnabled,
      setIntroComplete,
      scrollLocked,
      setScrollLocked,
    }),
    [
      reducedMotion,
      introComplete,
      introEnabled,
      setIntroComplete,
      scrollLocked,
    ]
  );

  const smoothScrollDisabled = reducedMotion || scrollLocked;

  return (
    <ProvidersContext.Provider value={value}>
      <SmoothScrollProvider disabled={smoothScrollDisabled}>
        <CustomCursor />
        {children}
      </SmoothScrollProvider>
    </ProvidersContext.Provider>
  );
}
