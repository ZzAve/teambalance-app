import { encode } from "@toon-format/toon";
import { AxiError } from "axi-sdk-js";
import { confluenceGet, type Json } from "../confluence.js";
import { parseLimit, rejectUnknownFlags, takeFlag } from "../args.js";
import { formatRelativeTime, renderHelp, renderOutput } from "../toon.js";

export const SEARCH_HELP = `usage: confluence-axi search <text> [flags]
flags:
  --space <key>   only pages in this space
  --cql "<cql>"   raw CQL query; replaces <text> and --space
  --limit <n>     1-100 (default 10)
examples:
  confluence-axi search release process
  confluence-axi search onboarding --space ENG
  confluence-axi search --cql 'label = "adr" ORDER BY lastmodified DESC'
`;

export async function searchCommand(args: string[]): Promise<string> {
  const rest = [...args];
  const rawCql = takeFlag(rest, "--cql");
  const space = takeFlag(rest, "--space");
  const limit = parseLimit(takeFlag(rest, "--limit"), 10);
  rejectUnknownFlags(rest, "search");
  const text = rest.join(" ").trim();

  const cql = rawCql ?? buildCql(text, space);

  const params = new URLSearchParams({ cql, limit: String(limit) });
  const response = await confluenceGet(`/rest/api/search?${params}`);
  const results: Json[] = response.results ?? [];

  if (results.length === 0) {
    return renderOutput([
      `pages: 0 results for ${JSON.stringify(cql)}`,
      renderHelp(["Try fewer words, or drop --space"]),
    ]);
  }

  const rows = results.map((result) => ({
    id: result.content?.id ?? null,
    title: result.title ?? result.content?.title ?? null,
    space: result.resultGlobalContainer?.title ?? null,
    updated: formatRelativeTime(result.lastModified),
  }));
  return renderOutput([
    `count: ${results.length} of ${response.totalSize ?? results.length}`,
    encode({ pages: rows }),
    renderHelp([`Run \`confluence-axi page ${rows[0].id}\` to read the first result`]),
  ]);
}

function buildCql(text: string, space: string | undefined): string {
  if (text === "") {
    throw new AxiError("A search text or --cql is required", "VALIDATION_ERROR", [
      "Run `confluence-axi search <text>`",
    ]);
  }
  const clauses = ["type = page"];
  if (space) clauses.push(`space = ${quote(space)}`);
  clauses.push(`text ~ ${quote(text)}`);
  return clauses.join(" AND ");
}

function quote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}
