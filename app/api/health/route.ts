import { NextResponse } from "next/server";

import packageJson from "@/package.json";

// Never cache/prerender — uptime and the current timestamp must reflect the
// live process, not a build-time snapshot.
export const dynamic = "force-dynamic";

// Set by the Dockerfile at image build time (see DEPLOYMENT.md); "unknown"
// covers `next dev`/non-Docker runs where it's never set.
const buildTime = process.env.BUILD_TIME ?? "unknown";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    version: packageJson.version,
    buildTime,
    uptime: process.uptime(),
  });
}
