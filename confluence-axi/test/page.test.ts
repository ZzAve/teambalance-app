import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pageCommand } from "../src/commands/page.js";
import { configureEnv, requestedUrl, stubFetch } from "./helpers.js";

function page(storage: string) {
  return {
    id: "123",
    title: "Release process",
    spaceId: "98765",
    version: { number: 7, createdAt: "2026-01-01T00:00:00.000Z" },
    body: { storage: { value: storage, representation: "storage" } },
    _links: { webui: "/spaces/ENG/pages/123/Release+process" },
  };
}

beforeEach(configureEnv);
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("page", () => {
  it("fetches the page in storage format from the v2 API", async () => {
    const fetchMock = stubFetch(200, page("<p>hi</p>"));

    await pageCommand(["123"]);

    const url = requestedUrl(fetchMock);
    expect(url.pathname).toBe("/wiki/api/v2/pages/123");
    expect(url.searchParams.get("body-format")).toBe("storage");
  });

  it("renders metadata and the body as markdown", async () => {
    stubFetch(
      200,
      page("<h2>Steps</h2><ul><li>Tag</li><li>Deploy</li></ul>"),
    );

    const output = await pageCommand(["123"]);

    expect(output).toContain("title: Release process");
    expect(output).toContain("version: 7");
    expect(output).toContain(
      "url: \"https://example.atlassian.net/wiki/spaces/ENG/pages/123/Release+process\"",
    );
    expect(output).toContain("## Steps");
    expect(output).toMatch(/-\s+Tag/);
  });

  it("keeps the contents of code macros", async () => {
    stubFetch(
      200,
      page(
        '<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[make build]]></ac:plain-text-body></ac:structured-macro>',
      ),
    );

    const output = await pageCommand(["123"]);

    expect(output).toContain("make build");
  });

  it("truncates long bodies and points at --full", async () => {
    stubFetch(200, page(`<p>${"a".repeat(5000)}</p>`));

    const truncated = await pageCommand(["123"]);
    expect(truncated).toContain("body (markdown, 3000 of 5000 chars):");
    expect(truncated).toContain("confluence-axi page 123 --full");

    const full = await pageCommand(["123", "--full"]);
    expect(full).toContain("body (markdown, 5000 chars):");
  });

  it("states an empty body explicitly", async () => {
    stubFetch(200, page(""));

    expect(await pageCommand(["123"])).toContain("body: empty");
  });

  it("requires a numeric page id", async () => {
    await expect(pageCommand(["abc"])).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });
});
