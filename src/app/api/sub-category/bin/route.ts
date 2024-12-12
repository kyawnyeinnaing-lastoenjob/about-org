import { NextResponse } from "next/server";

import { getBinSubCategories } from "@/lib/services/subCategory";

export async function GET() {
  try {
    const subCategories = await getBinSubCategories();
    if (!subCategories) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        status: subCategories.status,
        message: subCategories.message,
        data: subCategories.data,
      },
      { status: subCategories.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
