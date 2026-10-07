/** Render next-step suggestions as a TOON list. */
export function renderHelp(lines: string[]): string {
  if (lines.length === 0) return "";
  return `help[${lines.length}]:\n${lines.map((line) => `  ${line}`).join("\n")}`;
}

/** Join non-empty TOON blocks into one output string. */
export function renderOutput(blocks: Array<string | undefined>): string {
  return blocks.filter(Boolean).join("\n");
}

export function formatRelativeTime(iso: string | undefined): string {
  if (!iso) return "unknown";
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "unknown";
  const minutes = Math.floor((Date.now() - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
