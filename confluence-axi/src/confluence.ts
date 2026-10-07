import { AxiError } from "axi-sdk-js";
import { readConfig } from "./config.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- JSON-parsed API objects have dynamic keys
export type Json = any;

const STATUS_CODES: Record<number, { code: string; message: string; suggestions: string[] }> = {
  401: {
    code: "AUTH_REQUIRED",
    message: "Confluence rejected the credentials",
    suggestions: ["Check CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN, then retry"],
  },
  403: {
    code: "FORBIDDEN",
    message: "No permission to read this Confluence content",
    suggestions: [],
  },
  404: {
    code: "NOT_FOUND",
    message: "Confluence content not found",
    suggestions: ["Run `confluence-axi search <text>` to find the page id"],
  },
  429: {
    code: "RATE_LIMITED",
    message: "Confluence API rate limit hit",
    suggestions: ["Wait ~60s before retrying"],
  },
};

/** GET a path below CONFLUENCE_URL and return the parsed JSON body. */
export async function confluenceGet(path: string): Promise<Json> {
  const config = readConfig();
  const credentials = Buffer.from(`${config.email}:${config.apiToken}`).toString("base64");
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}${path}`, {
      headers: { authorization: `Basic ${credentials}`, accept: "application/json" },
    });
  } catch (error) {
    throw new AxiError(
      `Could not reach ${config.baseUrl}: ${error instanceof Error ? error.message : String(error)}`,
      "NETWORK_ERROR",
      ["Check CONFLUENCE_URL and your network connection"],
    );
  }
  if (response.ok) return response.json();

  const known = STATUS_CODES[response.status];
  if (known) throw new AxiError(known.message, known.code, known.suggestions);
  if (response.status === 400) {
    const message = (await readMessage(response)) ?? "Confluence rejected the request";
    throw new AxiError(message, "VALIDATION_ERROR");
  }
  throw new AxiError(`Confluence returned HTTP ${response.status}`, "CONFLUENCE_ERROR");
}

async function readMessage(response: Response): Promise<string | undefined> {
  try {
    const body = await response.json();
    return typeof body?.message === "string" ? body.message : undefined;
  } catch {
    return undefined;
  }
}
