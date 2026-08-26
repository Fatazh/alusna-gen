import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd(), "VITE_");
const errors = [];

function validateOrigin(value) {
  if (!value) {
    errors.push("VITE_SITE_URL is required.");
    return;
  }

  try {
    const url = new URL(value);
    const placeholder =
      /(?:\.(?:example|invalid|test|localhost)$|(?:^|\.)(?:example\.(?:com|net|org)|domain-anda\.com)$)/i.test(
        url.hostname,
      );
    if (url.protocol !== "https:") errors.push("VITE_SITE_URL must use HTTPS.");
    if (url.username || url.password) errors.push("VITE_SITE_URL must not contain credentials.");
    if (url.pathname !== "/" || url.search || url.hash) {
      errors.push("VITE_SITE_URL must be an origin without a path, query, or fragment.");
    }
    if (placeholder) errors.push("VITE_SITE_URL still uses a placeholder domain.");
  } catch {
    errors.push("VITE_SITE_URL must be a valid absolute URL.");
  }
}

function validateEmail(value) {
  if (!value) {
    errors.push("VITE_CONTACT_EMAIL is required.");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    errors.push("VITE_CONTACT_EMAIL must be a valid email address.");
  }
  if (
    /@(?:[^@]+\.)?(?:example|invalid|test|localhost)$/i.test(value) ||
    /@(?:[^@]+\.)?example\.(?:com|net|org)$/i.test(value) ||
    /@(?:[^@]+\.)?domain-anda\.com$/i.test(value)
  ) {
    errors.push("VITE_CONTACT_EMAIL still uses a placeholder domain.");
  }
}

validateOrigin(env.VITE_SITE_URL?.trim());
validateEmail(env.VITE_CONTACT_EMAIL?.trim());

if (errors.length > 0) {
  console.error("Production configuration is not ready:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Production environment is valid.");
