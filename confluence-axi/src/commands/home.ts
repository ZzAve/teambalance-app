import { renderHelp, renderOutput } from "../toon.js";

export function homeCommand(): string {
  const site = process.env.CONFLUENCE_URL;
  return renderOutput([
    site ? `site: ${site}` : "site: not configured",
    renderHelp(
      site
        ? ["Run `confluence-axi search <text>` to find pages", "Run `confluence-axi page <id>` to read one"]
        : ["Set CONFLUENCE_URL, CONFLUENCE_EMAIL and CONFLUENCE_API_TOKEN"],
    ),
  ]);
}
