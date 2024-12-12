import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import { createUser } from "@/lib/services/auth";
import { userSchema } from "@/lib/zod";
import { Status } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = await userSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.errors },
        { status: 400 },
      );
    }

    const { name, userId, email, password, status, phone, roleId, image } =
      parsed.data;

    const hashedPassword = await bcrypt.hash(password, 10);

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

// export const POST = async (req: Request) => {
//   const { name, userId, email, password } = await req.json();

//   const existingUser = await prisma.user.findUnique({
//     where: { email }
//   });

//   if (existingUser) {
//     return NextResponse.json(
//       { message: "User already exists!" },
//       { status: 409 }
//     );
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   // Create a new user
//   const user = await prisma.user.create({
//     data: { name, userId, email, password: hashedPassword }
//   });

//   return NextResponse.json(user, { status: 201 });
// };
