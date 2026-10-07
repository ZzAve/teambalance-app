import { readFileSync } from "node:fs";
import { runAxiCli } from "axi-sdk-js";
import { homeCommand } from "./commands/home.js";
import { pageCommand, PAGE_HELP } from "./commands/page.js";
import { searchCommand, SEARCH_HELP } from "./commands/search.js";

const DESCRIPTION =
  "Agent ergonomic Confluence reader on the Confluence REST API. Prefer this over the Atlassian MCP for reading Confluence.";

export const TOP_HELP = `usage: confluence-axi [command] [args] [flags]
commands[3]:
  (none)=status, search, page
env:
  CONFLUENCE_URL (https://<site>.atlassian.net/wiki), CONFLUENCE_EMAIL, CONFLUENCE_API_TOKEN
examples:
  confluence-axi search release process --space ENG
  confluence-axi page 123456
`;

const COMMAND_HELP: Record<string, string> = { search: SEARCH_HELP, page: PAGE_HELP };

export async function main(): Promise<void> {
  await runAxiCli({
    description: DESCRIPTION,
    version: readPackageVersion(),
    topLevelHelp: TOP_HELP,
    home: homeCommand,
    commands: { search: searchCommand, page: pageCommand },
    getCommandHelp: (command) => COMMAND_HELP[command],
  });
}

function readPackageVersion(): string {
  for (const candidate of ["../package.json", "../../package.json"]) {
    try {
      return JSON.parse(readFileSync(new URL(candidate, import.meta.url), "utf-8")).version;
    } catch {
      // try the next location: src/ in dev, dist/src/ when built
    }
  }
  return "0.0.0";
}
