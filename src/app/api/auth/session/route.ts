import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  initialSession,
  SessionData,
  sessionOptions,
} from "@/lib/session-options";

export async function GET() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  if (!session.isLoggedIn) {
    return NextResponse.json(initialSession);
  }
  return NextResponse.json(session);
}

// logout
export async function DELETE() {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  session.destroy();
  return NextResponse.json(initialSession);
}
