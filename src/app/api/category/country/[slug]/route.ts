import { NextRequest, NextResponse } from "next/server";

import { getAllCategoriesByCountry } from "@/lib/services/mainCategory";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const mainCategories = await getAllCategoriesByCountry(slug);
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
