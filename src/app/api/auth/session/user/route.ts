import { NextResponse } from "next/server";

import { getUser } from "@/lib/services/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        status: user.status,
        message: user.message,
        data: user.data,
      },
      { status: user.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
