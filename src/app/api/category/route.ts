import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/client";
import {
  createMainCategory,
  findExistingCategoryName,
  getAllMainCategories,
  getMainCategorySortingNumber,
  swapMainCategorySortingNumber,
} from "@/lib/services/mainCategory";
import { mainCategorySchema, swapSortNumberSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET() {
  try {
    const mainCategories = await getAllMainCategories();
    if (!mainCategories) {
      return NextResponse.json(
        { error: "MainCategories not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        status: mainCategories.status,
        message: mainCategories.message,
        data: mainCategories.data,
      },
      { status: mainCategories.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await mainCategorySchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { name, categoryImage, countryId, status } = parsed.data;

    const sortingNumber = await getMainCategorySortingNumber();

    const existingData = await prisma.mainCategory.findFirst({
      where: {
        name,
        countryId,
      },
    });

    if (existingData) {
      return NextResponse.json(
        {
          status: 409,
          message: "Main Category with this name already exists!.",
        },
        { status: 409 },
      );
    }

    // const existingCountry = await getCountryById(countryId!);

    const getSlug = await findExistingCategoryName(name, sortingNumber);

    const data = await createMainCategory({
      name,
      slug: getSlug?.data,
      categoryImage: categoryImage ?? null,
      countryId: countryId,
      status: status as Status,
      sortingNumber,
      isDeleted: false,
    });

    return NextResponse.json(
      { data, message: data.message, status: data.status },
      { status: data.status },
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to create mainCategory" },
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

    const data = await swapMainCategorySortingNumber(id1, id2);

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
