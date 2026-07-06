import "server-only";

import { execFileSync } from "node:child_process";

export type CommitInfo = {
  hash: string;
  message: string;
  date: string;
};

const FIELD_SEPARATOR = "\x1f";

// Best-effort: reads the last commit for the Dev Dashboard's status card.
// Returns null if git isn't available (e.g. a deployment without .git) so
// the page can render a graceful fallback instead of failing.
export function getLastCommit(): CommitInfo | null {
  try {
    const output = execFileSync(
      "git",
      [
        "log",
        "-1",
        `--pretty=format:%h${FIELD_SEPARATOR}%s${FIELD_SEPARATOR}%ad`,
        "--date=short",
      ],
      { cwd: process.cwd(), encoding: "utf8" }
    ).trim();

    const [hash, message, date] = output.split(FIELD_SEPARATOR);
    if (!hash) return null;

    return { hash, message, date };
  } catch {
    return null;
  }
}
