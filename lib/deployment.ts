type DeploymentEnvironment = Record<string, string | undefined>;

/**
 * Vercel preview/custom environments must fail closed for indexing.
 * Local `next start` is intentionally treated as production-like so the
 * generated SEO output can be tested before deployment.
 */
export function isNonProductionVercelDeployment(env: DeploymentEnvironment = process.env): boolean {
  if (env.VERCEL !== "1") return false;
  const target = env.VERCEL_TARGET_ENV || env.VERCEL_ENV;
  return target !== "production";
}
