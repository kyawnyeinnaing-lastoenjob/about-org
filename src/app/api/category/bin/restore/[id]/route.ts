import { NextRequest, NextResponse } from "next/server";

import { restoreMainCategory } from "@/lib/services/mainCategory";
import { mainCategorySchema } from "@/lib/zod";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = await mainCategorySchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedData = await restoreMainCategory(id, parsed?.data);

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
      { error: "Failed to update MainCategory" },
      { status: 500 },
    );
  }
}
