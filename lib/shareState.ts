/**
 * Encodes calculator inputs into a compact, URL-safe string (`?e=...`) so a
 * calculation can be shared or bookmarked. No personal data is involved -
 * only the numeric inputs of the form. Nothing is sent to a server.
 */

const PARAM = "e";

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeShareState(state: unknown): string {
  return toBase64Url(JSON.stringify(state));
}

export function decodeShareState(value: string | null | undefined): unknown {
  if (!value || value.length > 8000) return null;
  try {
    return JSON.parse(fromBase64Url(value));
  } catch {
    return null;
  }
}

/** Reads the shared state from the current URL (browser only). */
export function readShareStateFromLocation(): unknown {
  if (typeof window === "undefined") return null;
  return decodeShareState(new URLSearchParams(window.location.search).get(PARAM));
}

/** Builds a URL that contains the given state, based on the current page URL. */
export function buildShareUrl(state: unknown): string {
  const url = new URL(window.location.href);
  url.hash = "";
  url.searchParams.set(PARAM, encodeShareState(state));
  return url.toString();
}

/** Replaces the current URL with one that contains the state (no history entry). */
export function writeShareStateToLocation(state: unknown | null): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (state === null) {
    url.searchParams.delete(PARAM);
  } else {
    url.searchParams.set(PARAM, encodeShareState(state));
  }
  window.history.replaceState(window.history.state, "", url.toString());
}

/** Builds a relative link to a calculator page pre-filled with a state (for internal links). */
export function buildPrefilledHref(path: string, state: unknown): string {
  return `${path}?${PARAM}=${encodeShareState(state)}`;
}

/** Small helpers for sanitizing decoded state. */
export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.slice(0, 40) : typeof value === "number" ? String(value) : fallback;
}

export function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function asOneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}
