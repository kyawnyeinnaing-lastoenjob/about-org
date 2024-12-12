import { NextRequest, NextResponse } from "next/server";

import {
  deleteListing,
  getListingBySlug,
  softDeleteListing,
  updateListing,
} from "@/lib/services/listing";
import { listingSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const listing = await getListingBySlug(id);

    if (!listing) {
      return NextResponse.json({ error: "No listings found" }, { status: 404 });
    }

    return NextResponse.json({
      status: listing.status,
      message: listing.message,
      data: listing.data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const body = await request.json();
    const { slug } = await context.params;
    const parsed = await listingSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedFields: Partial<{
      title: string;
      shortDescription: string;
      description: string;
      mainCategoryId: string;
      countryId: string;
      sortingNumber: number;
      status: Status;
      detailImage: string;
      slug: string;
      shareHashTag: string;
      shareTitle: string;
      shareDescription: string;
      shareToFacebook: Status;
      shareToViber: Status;
      shareToTelegram: Status;
    }> = {};

    if (parsed.data.title !== undefined)
      updatedFields.title = parsed.data.title;
    if (parsed.data.shortDescription !== undefined)
      updatedFields.shortDescription = parsed.data.shortDescription;
    if (parsed.data.description !== undefined)
      updatedFields.description = parsed.data.description;
    if (parsed.data.mainCategoryId !== undefined)
      updatedFields.mainCategoryId = parsed.data.mainCategoryId;
    if (parsed.data.countryId !== undefined)
      updatedFields.countryId = parsed.data.countryId;
    if (parsed.data.status !== undefined)
      updatedFields.status = parsed.data.status;
    if (parsed.data.shareToFacebook !== undefined)
      updatedFields.shareToFacebook = parsed.data.shareToFacebook;
    if (parsed.data.shareToViber !== undefined)
      updatedFields.shareToViber = parsed.data.shareToViber;
    if (parsed.data.shareToTelegram !== undefined)
      updatedFields.shareToTelegram = parsed.data.shareToTelegram;
    if (
      parsed.data.detailImage !== undefined &&
      parsed.data.detailImage.length > 0
    )
      updatedFields.detailImage = parsed.data.detailImage;
    if (
      parsed.data.shareHashTag !== undefined &&
      parsed.data.shareHashTag.length > 0
    )
      updatedFields.shareHashTag = parsed.data.shareHashTag;
    if (
      parsed.data.shareTitle !== undefined &&
      parsed.data.shareTitle.length > 0
    )
      updatedFields.shareTitle = parsed.data.shareTitle;
    if (
      parsed.data.shareDescription !== undefined &&
      parsed.data.shareDescription.length > 0
    )
      updatedFields.shareDescription = parsed.data.shareDescription;

    const updatedData = await updateListing(slug, updatedFields);

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
      { error: "Failed to update listing" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string; hardDelete?: boolean }> },
  // { params }: { params: { id: string; hardDelete?: boolean } }
) {
  const { slug } = await context.params;
  const body = await request.json();

  if (!slug) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const deletedData = !body?.hardDelete
      ? await softDeleteListing(slug)
      : await deleteListing(slug);

    return NextResponse.json({
      success: true,
      status: deletedData.status,
      message: deletedData.message,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
