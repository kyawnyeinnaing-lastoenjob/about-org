import { NextRequest, NextResponse } from "next/server";

import { createAbout, getAbout } from "@/lib/services/about";
import { aboutUsSchema } from "@/lib/zod";

export async function GET() {
  try {
    const about = await getAbout();

    if (about?.data?.length === 0) {
      return NextResponse.json(
        { data: null, message: "No record found!" },
        { status: 200 },
      );
    }

    const data = {
      id: about.data[0].id,
      description: about.data[0].description,
      slogan: about.data[0].slogan,
      image: about.data[0].image,
      createdAt: about.data[0].createdAt,
      updatedAt: about.data[0].updatedAt,
    };

    if (!about) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: about.status,
      message: about.message,
      data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await aboutUsSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { description, image, slogan } = parsed.data;

    const data = await createAbout({
      description,
      image,
      slogan,
    });

    return NextResponse.json(
      {
        data,
        message: data.message,
        status: data.status,
      },
      { status: data.status },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await aboutUsSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedData = {
      // phone: parsed.data.phone.map((item) => item.value),
      // email: parsed.data.email.map((item) => item.value),
      // description: parsed.data.description,
      // socials:
      //   parsed.data.socials.map((each) => ({
      //     name: each.name || "",
      //     url: each.url || "",
      //     slug: each.slug || "",
      //     id: each.id || "",
      //     contactId: each.contactId || ""
      //   })) || []
    };

    console.log("updated data => ", updatedData);

    // const updated = await updateContact(params.id, updatedData);

    return NextResponse.json(
      {
        // status: updated.status,
        // message: updated.message,
        // data: updated
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
