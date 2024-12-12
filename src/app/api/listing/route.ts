import { NextRequest, NextResponse } from "next/server";

import {
  createListing,
  getAllListings,
  getListingSortingNumber,
  swapListingSortingNumber,
} from "@/lib/services/listing";
import { getSubCategoryById } from "@/lib/services/subCategory";
import { parseQueryParams } from "@/lib/utils/helper";
import { listingSchema, swapSortNumberSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { page, limit, skip, dateSorting, keyword, search } =
      parseQueryParams(request.url);

    const listings = await getAllListings(
      skip,
      limit,
      dateSorting,
      keyword,
      search,
    );

    if (!listings.data) {
      return NextResponse.json({ error: "No listings found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: listings.status,
        message: listings.message,
        data: listings.data,
        pagination: {
          page,
          limit,
          totalCount: listings.totalCount,
        },
      },
      { status: listings.status },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await listingSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const {
      title,
      shortDescription,
      description,
      detailImage,
      mainCategoryId,
      subCategoryId,
      countryId,
      status,
      shareHashTag,
      shareTitle,
      shareDescription,
      shareToFacebook,
      shareToViber,
      shareToTelegram,
    } = parsed.data;

    const existingSubCategory = await getSubCategoryById(subCategoryId!);

    const sortingNumber = await getListingSortingNumber();

    const data = await createListing({
      title,
      shortDescription,
      description,
      sortingNumber,
      slug:
        title.toLowerCase().replace(/[\p{P}\p{S}\p{Z}]+/gu, "-") +
        "-" +
        existingSubCategory?.slug,
      status: status as Status,
      isDeleted: false,
      detailImage: detailImage ?? null,
      subCategoryId: subCategoryId ?? null,
      mainCategoryId,
      countryId,
      shareHashTag: shareHashTag ?? null,
      shareTitle: shareTitle ?? null,
      shareDescription: shareDescription ?? null,
      shareToFacebook: shareToFacebook as Status,
      shareToViber: shareToViber as Status,
      shareToTelegram: shareToTelegram as Status,
    });

    return NextResponse.json(
      { data, message: data.message, status: data.status },
      { status: data.status },
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
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

    const data = await swapListingSortingNumber(id1, id2);

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
