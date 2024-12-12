import { NextRequest, NextResponse } from "next/server";

import { updateAbout } from "@/lib/services/about";
import { aboutUsSchema } from "@/lib/zod";

// PUT: Update an existing info item
type Context = { params: Promise<{ id: string }> };
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = await aboutUsSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedData = {
      slogan: parsed.data.slogan,
      image: parsed.data.image,
      description: parsed.data.description,
    };

    const updated = await updateAbout(id, updatedData);

    return NextResponse.json(
      {
        status: updated.status,
        message: updated.message,
        data: updated,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

// DELETE: Delete an existing info item
// export async function DELETE(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");

//   if (!id) {
//     return NextResponse.json({ error: "ID is required" }, { status: 400 });
//   }

//   try {
//     await prisma.info.delete({
//       where: { id: Number(id) }
//     });

//     return NextResponse.json({ success: true, message: "Info deleted" });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to delete info" },
//       { status: 500 }
//     );
//   }
// }
