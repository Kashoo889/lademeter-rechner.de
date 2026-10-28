import { describe, expect, it } from "vitest";
import { isNonProductionVercelDeployment } from "@/lib/deployment";

describe("Vercel deployment environment", () => {
  it("keeps local production-server tests indexable", () => {
    expect(isNonProductionVercelDeployment({})).toBe(false);
  });

  it("allows only an explicit Vercel production environment", () => {
    expect(isNonProductionVercelDeployment({ VERCEL: "1", VERCEL_ENV: "production" })).toBe(false);
    expect(isNonProductionVercelDeployment({ VERCEL: "1", VERCEL_TARGET_ENV: "production" })).toBe(false);
  });

  it("fails closed for preview, development, custom and incomplete Vercel environments", () => {
    expect(isNonProductionVercelDeployment({ VERCEL: "1", VERCEL_ENV: "preview" })).toBe(true);
    expect(isNonProductionVercelDeployment({ VERCEL: "1", VERCEL_ENV: "development" })).toBe(true);
    expect(isNonProductionVercelDeployment({ VERCEL: "1", VERCEL_TARGET_ENV: "staging" })).toBe(true);
    expect(isNonProductionVercelDeployment({ VERCEL: "1" })).toBe(true);
  });

  it("treats only the production environment on Railway as indexable", () => {
    expect(isNonProductionVercelDeployment({ RAILWAY_ENVIRONMENT_NAME: "production" })).toBe(false);
    expect(isNonProductionVercelDeployment({ RAILWAY_ENVIRONMENT_NAME: "pr-12" })).toBe(true);
    expect(isNonProductionVercelDeployment({ RAILWAY_ENVIRONMENT_NAME: "staging" })).toBe(true);
  });
});
