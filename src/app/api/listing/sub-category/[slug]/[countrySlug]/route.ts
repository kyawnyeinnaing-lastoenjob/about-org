import { NextRequest, NextResponse } from "next/server";

import {
  getAllListingsBySubCateSlugAndCountrySlug,
  getMetaBySubCatSlug,
} from "@/lib/services/listing";
import { parseQueryParams } from "@/lib/utils/helper";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; countrySlug: string }> },
) {
  try {
    const { slug: subCateSlug, countrySlug } = await context.params;
    const { page, limit, skip, dateSorting, keyword, search } =
      parseQueryParams(request.url);

    const meta = await getMetaBySubCatSlug(subCateSlug);

    const listings = await getAllListingsBySubCateSlugAndCountrySlug({
      params: {
        skip,
        limit,
        dateSorting,
        keyword,
        search,
      },
      slugs: {
        subCateSlug,
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
