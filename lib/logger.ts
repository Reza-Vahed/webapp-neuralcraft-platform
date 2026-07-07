type LogMeta = Record<string, unknown> | Error | undefined;

type LogLevel = "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";

function normalizeMeta(meta: LogMeta): Record<string, unknown> | undefined {
  if (meta === undefined) return undefined;
  if (meta instanceof Error) {
    return { name: meta.name, message: meta.message, stack: meta.stack };
  }
  return meta;
}

function write(level: LogLevel, message: string, meta: LogMeta) {
  const normalizedMeta = normalizeMeta(meta);
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(normalizedMeta && { meta: normalizedMeta }),
  };

  // Structured JSON in production (easy to parse from journald/docker logs
  // on a Hetzner deployment), human-readable in development. This is the
  // only file in the project allowed to call `console` directly — see
  // eslint.config.mjs's `no-console` override.
  const line = isProd
    ? JSON.stringify(entry)
    : `[${level}] ${message}${normalizedMeta ? " " + JSON.stringify(normalizedMeta) : ""}`;

  console[level](line);
}

export const logger = {
  info: (message: string, meta?: LogMeta) => write("info", message, meta),
  warn: (message: string, meta?: LogMeta) => write("warn", message, meta),
  error: (message: string, meta?: LogMeta) => write("error", message, meta),
};
