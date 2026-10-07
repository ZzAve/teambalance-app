import { vi } from "vitest";

export const BASE_URL = "https://example.atlassian.net/wiki";

export function configureEnv(): void {
  vi.stubEnv("CONFLUENCE_URL", BASE_URL);
  vi.stubEnv("CONFLUENCE_EMAIL", "agent@example.com");
  vi.stubEnv("CONFLUENCE_API_TOKEN", "secret-token");
}

export function stubFetch(status: number, body: unknown) {
  const fetchMock = vi.fn(
    async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function requestedUrl(fetchMock: ReturnType<typeof stubFetch>): URL {
  return new URL(fetchMock.mock.calls[0][0]);
}
