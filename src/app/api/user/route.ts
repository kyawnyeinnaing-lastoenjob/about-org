import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/client";
import { createUser, getUser } from "@/lib/services/auth";
import { getUsers } from "@/lib/services/user";
import { userSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function GET() {
  try {
    const user = await getUsers();
    const userData = await getUser();

    if (userData.data?.role?.roleName !== "Super Admin") {
      return NextResponse.json(
        { error: "You are not authorized!" },
        { status: 401 },
      );
    }

    if (user?.data?.length === 0) {
      return NextResponse.json(
        { data: [], message: "No record found!" },
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

// Create User with role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData = await getUser();
    if (userData.data?.role?.roleName !== "Super Admin") {
      return NextResponse.json(
        { error: "You are not authorized!" },
        { status: 401 },
      );
    }

    const parsed = await userSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { name, userId, email, password, status, phone, image } = parsed.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingRole = await prisma.role.findFirst({
      where: {
        roleName: {
          startsWith: "User",
        },
      },
    });

    const roleId = existingRole?.id || "";

    const user = await createUser({
      name,
      userId,
      email,
      password: hashedPassword,
      status: status as Status,
      phone: phone as string,
      roleId: roleId as string,
      image: image as string,
    });

    return NextResponse.json({
      data: user.data,
      message: user.message,
      status: user.status,
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
