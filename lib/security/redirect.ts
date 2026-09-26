/**
 * Security Utility: Open Redirect Defense
 * Ensures that redirect URLs are strictly internal relative paths
 * and cannot be exploited for external phishing or domain hops.
 */

export function sanitizeRedirectUrl(url: string | null | undefined, fallback = "/today"): string {
  if (!url || typeof url !== "string") {
    return fallback;
  }

  const trimmed = url.trim();

  // Must begin with a single forward slash, not protocol-relative (//)
  // and must not contain schema (e.g. http:, https:, javascript:)
  if (
    trimmed.startsWith("/") &&
    !trimmed.startsWith("//") &&
    !trimmed.startsWith("/\\") &&
    !trimmed.includes("://") &&
    !trimmed.includes("\r") &&
    !trimmed.includes("\n")
  ) {
    return trimmed;
  }

  return fallback;
}
