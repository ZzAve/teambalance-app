import { AxiError } from "axi-sdk-js";

export interface ConfluenceConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

const SETTINGS = ["CONFLUENCE_URL", "CONFLUENCE_EMAIL", "CONFLUENCE_API_TOKEN"];

export function readConfig(): ConfluenceConfig {
  const missing = SETTINGS.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new AxiError(`Missing ${missing.join(", ")}`, "CONFIG_REQUIRED", [
      "Set CONFLUENCE_URL to the site's wiki root, e.g. https://<site>.atlassian.net/wiki",
      "Set CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN (create a token at https://id.atlassian.com/manage-profile/security/api-tokens)",
    ]);
  }
  return {
    baseUrl: process.env.CONFLUENCE_URL!.replace(/\/+$/, ""),
    email: process.env.CONFLUENCE_EMAIL!,
    apiToken: process.env.CONFLUENCE_API_TOKEN!,
  };
}
