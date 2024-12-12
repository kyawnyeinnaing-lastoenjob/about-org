import { NextRequest, NextResponse } from "next/server";

import {
  getAllListingsByMainCateSlugAndCountrySlug,
  getMetaByMainCatSlug,
} from "@/lib/services/listing";
import { parseQueryParams } from "@/lib/utils/helper";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; countrySlug: string }> },
) {
  try {
    const { slug: mainCateSlug, countrySlug } = await context.params;
    const { page, limit, skip, dateSorting, keyword, search } =
      parseQueryParams(request.url);
    const meta = await getMetaByMainCatSlug(mainCateSlug);

    const listings = await getAllListingsByMainCateSlugAndCountrySlug({
      params: {
        skip,
        limit,
        dateSorting,
        keyword,
        search,
      },
      slugs: {
        mainCateSlug,
        countrySlug,
      },
    });

    if (!listings.data) {
      return NextResponse.json(
        { status: 404, meta, error: "No listings found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        status: listings.status,
        message: listings.message,
        meta,
        pagination: {
          page,
          limit,
          totalCount: listings.totalCount,
        },
        data: listings.data,
      },
      { status: listings.status },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
