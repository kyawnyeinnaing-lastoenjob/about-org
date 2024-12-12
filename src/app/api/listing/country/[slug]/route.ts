import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/client";
import {
  createListing,
  getAllListings,
  getListingSortingNumber,
  getMetaByCountrySlug,
} from "@/lib/services/listing";
import { getMainCategoryById } from "@/lib/services/mainCategory";
import { parseQueryParams } from "@/lib/utils/helper";
import { listingSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const { page, limit, skip, dateSorting, keyword, search } =
      parseQueryParams(request.url);

    const meta = await getMetaByCountrySlug(slug);

    const listings = await getAllListings(
      skip,
      limit,
      dateSorting,
      keyword,
      search,
      slug,
    );

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

    const existingData = await prisma.listing.findFirst({
      where: {
        title: title,
        ...(subCategoryId && { subCategoryId }),
        mainCategoryId,
        countryId,
      },
    });

    if (existingData) {
      return NextResponse.json(
        { error: "Title already exists" },
        { status: 409 },
      );
    }

    const existingCategory = await getMainCategoryById(mainCategoryId!);
    const sortingNumber = await getListingSortingNumber();

    const data = await createListing({
      title,
      shortDescription,
      description,
      slug:
        title.toLowerCase().replace(/[\p{P}\p{S}\p{Z}]+/gu, "-") +
        "-" +
        existingCategory?.slug,
      sortingNumber,
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
