import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { loginUser } from "@/lib/services/auth";
import { SessionData, sessionOptions } from "@/lib/session-options";
import { loginSchema } from "@/lib/zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = await loginSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { userId, password } = parsed.data;
    const user = await loginUser({
      userId,
      password,
    });

    if (user.data?.token) {
      const session = await getIronSession<SessionData>(await cookies(), {
        ...sessionOptions,
      });
      session.isLoggedIn = true;
      session.adminToken = user?.data?.token || "";
      await session.save();
    }

    return NextResponse.json(
      { data: user.data, message: user.message, status: user.status },
      { status: user.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
