import { NextRequest, NextResponse } from "next/server";

import { createSetting, getSettings } from "@/lib/services/setting";
import { settingSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET() {
  try {
    const setting = await getSettings();

    if (!setting) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: setting.status,
      message: setting.message,
      data: setting.data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = await settingSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }
    const { name, status } = parsed.data;
    const setting = await createSetting({
      name,
      type: name.toLowerCase().replace(/[\p{P}\p{S}\p{Z}]+/gu, "-"),
      status: status as Status,
    });

    if (!setting) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: setting.status,
      message: setting.message,
      data: setting.data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
