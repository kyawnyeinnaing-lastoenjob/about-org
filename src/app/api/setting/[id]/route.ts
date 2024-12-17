import { NextRequest, NextResponse } from "next/server";

import { updateSetting } from "@/lib/services/setting";
import { settingSchema } from "@/lib/zod";

// PUT: Update an existing setting
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = await settingSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedData = {
      status: parsed.data.status,
    };

    const updated = await updateSetting(id, updatedData);

    return NextResponse.json(
      {
        status: updated.status,
        message: updated.message,
        data: updated,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
