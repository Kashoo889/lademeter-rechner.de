import { afterEach, describe, expect, it, vi } from "vitest";

async function load(env: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) vi.stubEnv(key, "");
    else vi.stubEnv(key, value);
  }
  return import("@/lib/analytics/config");
}

describe("analytics config", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is off by default", async () => {
    const config = await load({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: undefined });
    expect(config.analyticsActive).toBe(false);
    expect(config.plausibleDomain).toBeNull();
  });

  it("activates with a valid domain and uses the default script address", async () => {
    const config = await load({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "lademeter-rechner.de", NEXT_PUBLIC_PLAUSIBLE_SRC: undefined });
    expect(config.analyticsActive).toBe(true);
    expect(config.plausibleSrc).toBe("https://plausible.io/js/script.js");
  });

  it("rejects an invalid domain and a non-https script address", async () => {
    const bad = await load({ NEXT_PUBLIC_PLAUSIBLE_DOMAIN: "not a domain", NEXT_PUBLIC_PLAUSIBLE_SRC: "http://evil.example/x.js" });
    expect(bad.analyticsActive).toBe(false);
    expect(bad.plausibleSrc).toBe("https://plausible.io/js/script.js");
  });
});
