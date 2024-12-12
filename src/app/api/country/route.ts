import { NextRequest, NextResponse } from "next/server";

import {
  createCountry,
  getAllCountries,
  getCountrySortingNumber,
  swapCountrySortingNumber,
} from "@/lib/services/country";
import { countrySchema, swapSortNumberSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET() {
  try {
    const countries = await getAllCountries();
    if (!countries) {
      return NextResponse.json(
        { error: "Countries not found" },
        { status: 404 },
      );
    }
    const data = countries.data.map((country) => {
      const { _count, ...rest } = country;
      return {
        ...rest,
        categoryCount: _count.MainCategory,
        subCategoryCount: _count.SubCategory,
      };
    });
    return NextResponse.json(
      {
        status: countries.status,
        message: countries.message,
        data,
      },
      { status: countries.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await countrySchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { name, status, countryCode, flag } = parsed.data;

    const sortingNumber = await getCountrySortingNumber();

    const data = await createCountry({
      name,
      slug: name.toLowerCase().replace(/[\p{P}\p{S}\p{Z}]+/gu, "-"),
      countryCode: countryCode ?? "",
      status: status as Status,
      sortingNumber,
      isDeleted: false,
      flag: flag ?? null,
    });

    return NextResponse.json(
      { data, message: data.message, status: data.status },
      { status: data.status },
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

    const data = await swapCountrySortingNumber(id1, id2);

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
