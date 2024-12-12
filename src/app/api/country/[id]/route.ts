import { NextRequest, NextResponse } from "next/server";

import {
  deleteCountry,
  softDeleteCountry,
  updateCountry,
} from "@/lib/services/country";
import { countrySchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = await countrySchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedFields: Partial<{
      name: string;
      countryCode: string;
      flag: string;
      status: Status;
      slug: string;
    }> = {};

    if (parsed.data.name !== undefined) updatedFields.name = parsed.data.name;
    if (parsed.data.countryCode !== undefined)
      updatedFields.countryCode = parsed.data.countryCode;
    if (parsed.data.status !== undefined)
      updatedFields.status = parsed.data.status;
    if (parsed.data.flag !== undefined && parsed.data.flag.length > 0)
      updatedFields.flag = parsed.data.flag;
    updatedFields.slug = parsed.data.name
      .toLowerCase()
      .replace(/[\p{P}\p{S}\p{Z}]+/gu, "-");

    const updatedData = await updateCountry(id, updatedFields);

    return NextResponse.json(
      {
        status: updatedData.status,
        message: updatedData.message,
        data: updatedData,
      },
      { status: updatedData.status },
    );
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json(
      { error: "Failed to update country" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; hardDelete?: boolean }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const deletedData = !body.hardDelete
      ? await softDeleteCountry(id)
      : await deleteCountry(id);

    return NextResponse.json({
      success: deletedData.success,
      status: deletedData.status,
      message: deletedData.message,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
