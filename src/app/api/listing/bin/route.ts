import { NextResponse } from "next/server";

import { getBinListings } from "@/lib/services/listing";

export async function GET() {
  try {
    const listings = await getBinListings();
    if (!listings) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        status: listings.status,
        message: listings.message,
        data: listings.data,
      },
      { status: listings.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
