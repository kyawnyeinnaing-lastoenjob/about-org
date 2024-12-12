import { NextRequest, NextResponse } from "next/server";

import { updateContact } from "@/lib/services/contact";
import { contactUsSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

// PUT: Update an existing info item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const parsed = await contactUsSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedData = {
      phone: parsed.data.phone.map((item) => item.value),
      email: parsed.data.email.map((item) => item.value),
      description: parsed.data.description,
      Socials:
        parsed.data.socials.map((each) => ({
          name: each.name || "",
          url: each.url || "",
          slug: each.slug || "",
          id: each.id || "",
          contactId: each.contactId || "",
          status: each.status || Status.ACTIVE,
          image: each.image ?? null,
        })) || [],
    };

    const updated = await updateContact(id, updatedData);

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
