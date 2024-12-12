import { NextRequest, NextResponse } from "next/server";

import { getListByCountry } from "@/lib/services/listing";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string; countrySlug: string }> },
) {
  try {
    const { slug, countrySlug } = await context.params;

    const listing = await getListByCountry(slug, countrySlug);

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
