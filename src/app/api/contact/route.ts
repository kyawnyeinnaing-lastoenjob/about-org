import { NextRequest, NextResponse } from "next/server";

import { createContact, getContact } from "@/lib/services/contact";
import { contactUsSchema } from "@/lib/zod";
// import { prisma } from "@/lib/prisma"; // Adjust this path as needed

export async function GET() {
  try {
    const contact = await getContact();

    if (contact?.data?.length === 0) {
      return NextResponse.json(
        { data: null, message: "No record found!" },
        { status: 200 },
      );
    }

    const data = {
      id: contact.data[0].id,
      phone: contact.data[0].phone.map((value) => ({
        value,
        isEditing: true,
      })),
      email: contact.data[0].email.map((value) => ({
        value,
        isEditing: true,
      })),
      description: contact.data[0].description,
      socials: contact.data[0].Socials,
    };
    if (!contact) {
      return NextResponse.json({ error: "Info not found" }, { status: 404 });
    }
    return NextResponse.json({
      status: contact.status,
      message: contact.message,
      data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await contactUsSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { phone, email, description, socials } = parsed.data;

    const data = await createContact({
      phone: phone.map((item) => item.value),
      email: email.map((item) => item.value),
      description,
      socials:
        socials.map((each) => ({
          ...each,
          image: each.image ?? null,
          slug: each.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_") || "",
        })) || [],
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
