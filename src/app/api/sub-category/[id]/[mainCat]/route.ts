import { NextRequest, NextResponse } from "next/server";

import { getMetaByMainCatSlug } from "@/lib/services/listing";
import { getAllSubCategoriesByMainCategory } from "@/lib/services/subCategory";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; mainCat: string }> },
) {
  try {
    const { id: country, mainCat } = await context.params;
    const subCategories = await getAllSubCategoriesByMainCategory(
      country,
      mainCat,
    );
    const meta = await getMetaByMainCatSlug(mainCat);
    if (!subCategories) {
      return NextResponse.json(
        { status: 404, meta, error: "Info not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        status: subCategories.status,
        message: subCategories.message,
        meta,
        data: subCategories.data,
      },
      { status: subCategories.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
