import { NextResponse } from "next/server";

import { getBinCountries } from "@/lib/services/country";

export async function GET() {
  try {
    const countries = await getBinCountries();
    if (!countries) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        status: countries.status,
        message: countries.message,
        data: countries.data,
      },
      { status: countries.status },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
