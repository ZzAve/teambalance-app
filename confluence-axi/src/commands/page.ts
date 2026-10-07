import { encode } from "@toon-format/toon";
import TurndownService from "turndown";
import { AxiError } from "axi-sdk-js";
import { confluenceGet } from "../confluence.js";
import { readConfig } from "../config.js";
import { rejectUnknownFlags, takeBoolFlag } from "../args.js";
import { formatRelativeTime, renderHelp, renderOutput } from "../toon.js";

const DEFAULT_BODY_CHARS = 3000;

export const PAGE_HELP = `usage: confluence-axi page <id> [flags]
flags:
  --full   print the whole body (default: first ${DEFAULT_BODY_CHARS} chars)
notes:
  The id is the number in the page URL: /spaces/<key>/pages/<id>/...
examples:
  confluence-axi page 123456
  confluence-axi page 123456 --full
`;

export async function pageCommand(args: string[]): Promise<string> {
  const rest = [...args];
  const full = takeBoolFlag(rest, "--full");
  rejectUnknownFlags(rest, "page");
  const id = rest[0];
  if (!id || !/^\d+$/.test(id)) {
    throw new AxiError("A numeric page id is required", "VALIDATION_ERROR", [
      "Run `confluence-axi search <text>` to find the page id",
    ]);
  }

  const page = await confluenceGet(`/api/v2/pages/${id}?body-format=storage`);
  const markdown = storageToMarkdown(page.body?.storage?.value ?? "");

  const blocks = [
    encode({
      page: {
        id: page.id,
        title: page.title,
        space_id: page.spaceId,
        version: page.version?.number ?? null,
        updated: formatRelativeTime(page.version?.createdAt),
        url: page._links?.webui ? `${readConfig().baseUrl}${page._links.webui}` : null,
      },
    }),
  ];
  if (markdown === "") {
    blocks.push("body: empty");
  } else if (full || markdown.length <= DEFAULT_BODY_CHARS) {
    blocks.push(`body (markdown, ${markdown.length} chars):\n${markdown}`);
  } else {
    blocks.push(
      `body (markdown, ${DEFAULT_BODY_CHARS} of ${markdown.length} chars):\n${markdown.slice(0, DEFAULT_BODY_CHARS)}`,
      renderHelp([`Run \`confluence-axi page ${id} --full\` for the whole body`]),
    );
  }
  return renderOutput(blocks);
}

/**
 * Confluence storage format is XHTML with `ac:`/`ri:` macro elements. The HTML
 * parser turns CDATA sections (used by code macros) into comments, so they are
 * unwrapped to escaped text first; other macro elements keep their text content.
 */
export function storageToMarkdown(storage: string): string {
  const unwrapped = storage.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, (_match, text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"),
  );
  return new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" })
    .turndown(unwrapped)
    .trim();
}
