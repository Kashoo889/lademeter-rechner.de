type DeploymentEnvironment = Record<string, string | undefined>;

/**
 * Vercel preview/custom environments and non-production Railway environments must fail closed for indexing.
 * Local `next start` is intentionally treated as production-like so the
 * generated SEO output can be tested before deployment.
 */
export function isNonProductionVercelDeployment(env: DeploymentEnvironment = process.env): boolean {
  // Railway sets RAILWAY_ENVIRONMENT_NAME; anything but the production environment (e.g. PR environments) stays out of the index.
  if (env.RAILWAY_ENVIRONMENT_NAME) return env.RAILWAY_ENVIRONMENT_NAME !== "production";
  if (env.VERCEL !== "1") return false;
  const target = env.VERCEL_TARGET_ENV || env.VERCEL_ENV;
  return target !== "production";
}
