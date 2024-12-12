import { NextRequest, NextResponse } from "next/server";

import {
  createSubCategory,
  findExistingSubCategoryName,
  getAllSubCategories,
  getSubCategorySortingNumber,
  swapSubCategorySortingNumber,
} from "@/lib/services/subCategory";
import { subCategorySchema, swapSortNumberSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET() {
  try {
    const subCategories = await getAllSubCategories();
    if (!subCategories) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        status: subCategories.status,
        message: subCategories.message,
        data: subCategories.data,
      },
      { status: subCategories.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // const existingMainCategory = await getMainCategoryById(mainCategoryId);

    const sortingNumber = await getSubCategorySortingNumber();
    const getSlug = await findExistingSubCategoryName(name, sortingNumber);

    const data = await createSubCategory({
      name,
      slug: getSlug?.data,
      mainCategoryId: mainCategoryId,
      subCategoryImage: subCategoryImage ?? null,
      countryId: countryId,
      status: status as Status,
      sortingNumber,
      isDeleted: false,
    });

    return NextResponse.json(
      { data, message: data.message, status: data.status },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to create country" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await swapSortNumberSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { id1, id2 } = parsed.data;

    const data = await swapSubCategorySortingNumber(id1, id2);

    return NextResponse.json(
      { data, message: data.message, status: data.status },
      { status: data.status },
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to swap country sorting number" },
      { status: 500 },
    );
  }
}
