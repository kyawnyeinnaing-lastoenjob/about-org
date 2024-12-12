import { NextResponse } from "next/server";

import { getBinMainCategories } from "@/lib/services/mainCategory";

export async function GET() {
  try {
    const mainCategories = await getBinMainCategories();
    if (!mainCategories) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        status: mainCategories.status,
        message: mainCategories.message,
        data: mainCategories.data,
      },
      { status: mainCategories.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
