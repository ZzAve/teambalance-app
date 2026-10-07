import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { confluenceGet } from "../src/confluence.js";
import { configureEnv, stubFetch } from "./helpers.js";

beforeEach(configureEnv);
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("confluenceGet", () => {
  it("sends basic auth built from email and API token", async () => {
    const fetchMock = stubFetch(200, {});

    await confluenceGet("/rest/api/search");

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers);
    expect(headers.get("authorization")).toBe(
      `Basic ${Buffer.from("agent@example.com:secret-token").toString("base64")}`,
    );
  });

  it.each([
    [401, "AUTH_REQUIRED"],
    [403, "FORBIDDEN"],
    [404, "NOT_FOUND"],
    [429, "RATE_LIMITED"],
    [500, "CONFLUENCE_ERROR"],
  ])("maps HTTP %i to %s", async (status, code) => {
    stubFetch(status, {});

    await expect(confluenceGet("/x")).rejects.toMatchObject({ code });
  });

  it("surfaces Confluence's message for a bad CQL query", async () => {
    stubFetch(400, { message: "Could not parse cql : foo" });

    await expect(confluenceGet("/x")).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
      message: "Could not parse cql : foo",
    });
  });

  it("names every missing setting before calling the network", async () => {
    vi.unstubAllEnvs();
    vi.stubEnv("CONFLUENCE_URL", "");
    vi.stubEnv("CONFLUENCE_EMAIL", "");
    vi.stubEnv("CONFLUENCE_API_TOKEN", "");
    const fetchMock = stubFetch(200, {});

    await expect(confluenceGet("/x")).rejects.toMatchObject({
      code: "CONFIG_REQUIRED",
      message:
        "Missing CONFLUENCE_URL, CONFLUENCE_EMAIL, CONFLUENCE_API_TOKEN",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
