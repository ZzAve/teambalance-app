import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { searchCommand } from "../src/commands/search.js";
import { configureEnv, requestedUrl, stubFetch } from "./helpers.js";

function result(overrides: Record<string, unknown> = {}) {
  return {
    content: { id: "123", type: "page", title: "Release process" },
    title: "Release process",
    excerpt: "How we ship",
    url: "/spaces/ENG/pages/123/Release+process",
    lastModified: "2026-01-01T00:00:00.000Z",
    resultGlobalContainer: { title: "Engineering" },
    ...overrides,
  };
}

beforeEach(configureEnv);
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("search", () => {
  it("turns free text into a text CQL query limited to pages", async () => {
    const fetchMock = stubFetch(200, { results: [], totalSize: 0 });

    await searchCommand(["release", "process"]);

    const url = requestedUrl(fetchMock);
    expect(url.pathname).toBe("/wiki/rest/api/search");
    expect(url.searchParams.get("cql")).toBe(
      'type = page AND text ~ "release process"',
    );
    expect(url.searchParams.get("limit")).toBe("10");
  });

  it("narrows to a space and passes raw CQL through untouched", async () => {
    const fetchMock = stubFetch(200, { results: [], totalSize: 0 });

    await searchCommand(["--space", "ENG", "--limit", "5", "x"]);
    expect(requestedUrl(fetchMock).searchParams.get("cql")).toBe(
      'type = page AND space = "ENG" AND text ~ "x"',
    );
    expect(requestedUrl(fetchMock).searchParams.get("limit")).toBe("5");

    fetchMock.mockClear();
    await searchCommand(["--cql", 'label = "adr"']);
    expect(requestedUrl(fetchMock).searchParams.get("cql")).toBe(
      'label = "adr"',
    );
  });

  it("escapes quotes in free text", async () => {
    const fetchMock = stubFetch(200, { results: [], totalSize: 0 });

    await searchCommand(['say "hi"']);

    expect(requestedUrl(fetchMock).searchParams.get("cql")).toBe(
      'type = page AND text ~ "say \\"hi\\""',
    );
  });

  it("renders results as a compact TOON table with a next step", async () => {
    stubFetch(200, { results: [result()], totalSize: 42 });

    const output = await searchCommand(["release"]);

    expect(output).toContain("count: 1 of 42");
    expect(output).toContain("pages[1]{id,title,space,updated}:");
    expect(output).toContain(`"123",Release process,Engineering,`);
    expect(output).toContain("confluence-axi page 123");
    expect(output).not.toContain("How we ship");
  });

  it("states an empty result explicitly", async () => {
    stubFetch(200, { results: [], totalSize: 0 });

    const output = await searchCommand(["nothing"]);

    expect(output).toContain('pages: 0 results for "type = page AND text ~ \\"nothing\\""');
  });

  it("requires a query", async () => {
    await expect(searchCommand([])).rejects.toMatchObject({
      code: "VALIDATION_ERROR",
    });
  });
});
