import { NextRequest, NextResponse } from "next/server";

import { getMainCategoryById } from "@/lib/services/mainCategory";
import {
  deleteSubCategory,
  softDeleteSubCategory,
  updateSubCategory,
} from "@/lib/services/subCategory";
import { subCategorySchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = await subCategorySchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { name, mainCategoryId, subCategoryImage, countryId, status } =
      parsed.data;

    const updatedFields: Partial<{
      name: string;
      mainCategoryId: string;
      subCategoryImage: string;
      status: Status;
      countryId: string;
      regionId: string;
      slug: string;
    }> = {
      name,
      mainCategoryId,
      subCategoryImage,
      countryId,
      status,
    };

    const existingMainCategory = await getMainCategoryById(mainCategoryId);

    if (
      parsed.data.subCategoryImage !== undefined &&
      parsed.data.subCategoryImage.length > 0
    )
      updatedFields.subCategoryImage = parsed.data.subCategoryImage;
    updatedFields.slug =
      parsed.data.name.toLowerCase().replace(/[\p{P}\p{S}\p{Z}]+/gu, "-") +
      "-" +
      existingMainCategory?.slug;

    const updatedData = await updateSubCategory(id, updatedFields);

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
      ? await softDeleteSubCategory(id)
      : await deleteSubCategory(id);

    return NextResponse.json({
      success: deletedData.success,
      status: deletedData.status,
      message: deletedData.message,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
