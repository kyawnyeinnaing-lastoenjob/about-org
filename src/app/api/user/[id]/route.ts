import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { getUser } from "@/lib/services/auth";
import { getUserById, updateUser } from "@/lib/services/user";
import { userUpdateSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

// PUT: Update an existing info item
type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const userData = await getUser();
    if (userData.data?.role?.roleName !== "Super Admin") {
      return NextResponse.json(
        { error: "You are not authorized!" },
        { status: 401 },
      );
    }

    const parsed = await userUpdateSchema.safeParseAsync(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const updatedFields: Partial<{
      name: string;
      userId: string;
      email: string;
      password: string;
      status: Status;
      phone: string;
      image: string;
    }> = {};

    if (parsed.data.name !== undefined) updatedFields.name = parsed.data.name;
    if (parsed.data.userId !== undefined)
      updatedFields.userId = parsed.data.userId;
    if (parsed.data.email !== undefined)
      updatedFields.email = parsed.data.email;
    if (parsed.data.password !== undefined && parsed?.data?.password.length > 0)
      updatedFields.password = await bcrypt.hash(parsed.data.password, 10);
    if (parsed.data.status !== undefined)
      updatedFields.status = parsed.data.status;
    if (parsed.data.phone !== undefined)
      updatedFields.phone = parsed.data.phone;
    if (parsed.data.userId !== undefined)
      updatedFields.userId = parsed.data.userId;
    if (parsed.data.image !== undefined)
      updatedFields.image = parsed.data.image;

    const updated = await updateUser(id, updatedFields);

    return NextResponse.json(
      {
        status: updated.status,
        message: updated.message,
        data: updated.data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const user = await getUserById(id);

    if (!user?.data) {
      return NextResponse.json(
        { data: null, message: "No record found!" },
        { status: 200 },
      );
    }

    return NextResponse.json({
      status: user.status,
      message: user.message,
      data: user.data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
