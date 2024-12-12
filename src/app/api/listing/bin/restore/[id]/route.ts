import { NextRequest, NextResponse } from "next/server";

import { restoreListing } from "@/lib/services/listing";
import { listingSchema } from "@/lib/zod";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await context.params;
    const parsed = await listingSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedData = await restoreListing(id, parsed?.data);

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
    return NextResponse.json({ error }, { status: 500 });
  }
}
