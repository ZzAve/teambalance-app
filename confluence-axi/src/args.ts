import { AxiError } from "axi-sdk-js";

/** Get a flag's value from `--flag value` or `--flag=value` and remove it from args. */
export function takeFlag(args: string[], flag: string): string | undefined {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag) {
      const value = args[i + 1];
      args.splice(i, 2);
      return value;
    }
    if (args[i].startsWith(`${flag}=`)) {
      const value = args[i].slice(flag.length + 1);
      args.splice(i, 1);
      return value;
    }
  }
  return undefined;
}

/** Check whether a boolean flag is present and remove it from args. */
export function takeBoolFlag(args: string[], flag: string): boolean {
  const index = args.indexOf(flag);
  if (index === -1) return false;
  args.splice(index, 1);
  return true;
}

export function parseLimit(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback;
  const limit = Number(raw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new AxiError(`--limit must be a whole number from 1 to 100, got ${raw}`, "VALIDATION_ERROR");
  }
  return limit;
}

export function rejectUnknownFlags(args: string[], command: string): void {
  const flag = args.find((arg) => arg.startsWith("--"));
  if (flag) {
    throw new AxiError(`Unknown flag for \`${command}\`: ${flag}`, "VALIDATION_ERROR", [
      `Run \`confluence-axi ${command} --help\``,
    ]);
  }
}
