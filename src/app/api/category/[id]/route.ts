import { NextRequest, NextResponse } from "next/server";

import {
  deleteMainCategory,
  findExistingCategoryName,
  getMainCategorySortingNumber,
  softDeleteMainCategory,
  updateMainCategory,
} from "@/lib/services/mainCategory";
import { mainCategorySchema } from "@/lib/zod";
import { Status } from "@prisma/client";

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

    const updatedFields: Partial<{
      name: string;
      mainCategoryCode: string;
      status: Status;
      categoryImage?: string;
      slug: string;
      countryId: string;
    }> = {};

    const sortingNumber = await getMainCategorySortingNumber();

    // const existingCountry = await getCountryById(parsed.data.countryId!);
    const getSlug = await findExistingCategoryName(
      parsed.data.name,
      sortingNumber,
    );

    if (parsed.data.name !== undefined) updatedFields.name = parsed.data.name;
    if (parsed.data.status !== undefined)
      updatedFields.status = parsed.data.status;
    if (
      parsed.data.categoryImage !== undefined &&
      parsed.data.categoryImage.length > 0
    )
      updatedFields.categoryImage = parsed.data.categoryImage;
    updatedFields.slug = getSlug?.data;

    const updatedData = await updateMainCategory(id, updatedFields);

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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const deletedData = !body?.hardDelete
      ? await softDeleteMainCategory(id)
      : await deleteMainCategory(id);

    return NextResponse.json({
      success: true,
      status: deletedData.status,
      message: deletedData.message,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
