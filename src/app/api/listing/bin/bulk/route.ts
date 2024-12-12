import { NextRequest, NextResponse } from "next/server";

import { restoreMultipleListings } from "@/lib/services/listing";
import { listingSchema } from "@/lib/zod";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      if (body.length > 0) {
        const updates = await Promise.all(
          body.map(async (listingUpdate) => {
            const parsed = await listingSchema.safeParseAsync(listingUpdate);

            console.log("parsed => ", parsed);

            if (!parsed.success) {
              throw new Error("Invalid input in bulk update");
            }
            const { id, isDeleted } = parsed.data;

            if (id === undefined || isDeleted === undefined) {
              throw new Error("Missing required fields in bulk update");
            }

            return {
              id,
              isDeleted,
            };
          }),
        );

        const updatedData = await restoreMultipleListings(updates);

        return NextResponse.json(
          {
            status: updatedData.status,
            message: updatedData.message,
            data: updatedData.data,
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { message: "Select a row to proceed!" },
          { status: 400 },
        );
      }
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
