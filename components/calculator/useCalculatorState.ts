"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { readShareStateFromLocation, writeShareStateToLocation } from "@/lib/shareState";

/**
 * Form state for a calculator that
 * - restores itself from a shared link (`?e=...`) after hydration,
 * - keeps the URL in sync once the user has calculated, so the address bar
 *   can be copied at any time,
 * - exposes `showErrors` so validation messages only appear after the first
 *   submit attempt.
 */
export function useCalculatorState<T>(
  initial: T,
  sanitize: (raw: unknown) => T | null,
  serialize: (state: T) => unknown = (state) => state,
) {
  const [state, setState] = useState<T>(initial);
  const [showErrors, setShowErrors] = useState(false);
  const [restoredFromLink, setRestoredFromLink] = useState(false);
  const syncUrl = useRef(false);
  const sanitizeRef = useRef(sanitize);
  const serializeRef = useRef(serialize);

  useEffect(() => {
    const restored = sanitizeRef.current(readShareStateFromLocation());
    if (restored) {
      syncUrl.current = true;
      // Restoring from the URL can only happen after hydration.
      setState(restored);
      setShowErrors(true);
      setRestoredFromLink(true);
    }
  }, []);

  useEffect(() => {
    if (syncUrl.current) writeShareStateToLocation(serializeRef.current(state));
  }, [state]);

  const markSubmitted = useCallback(() => {
    setShowErrors(true);
    syncUrl.current = true;
    writeShareStateToLocation(serializeRef.current(state));
  }, [state]);

  const reset = useCallback(() => {
    syncUrl.current = false;
    writeShareStateToLocation(null);
    setState(initial);
    setShowErrors(false);
    setRestoredFromLink(false);
  }, [initial]);

  return { state, setState, showErrors, markSubmitted, reset, restoredFromLink };
}

let rowCounter = 0;

/** Stable, unique ids for dynamically added form rows. */
export function nextRowId(): string {
  rowCounter += 1;
  return `row-${rowCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Scrolls the result panel into view when it is not visible (mobile layout). */
export function revealResult(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const rect = element.getBoundingClientRect();
  if (rect.top < 64 || rect.top > window.innerHeight - 120) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  element.focus({ preventScroll: true });
}
