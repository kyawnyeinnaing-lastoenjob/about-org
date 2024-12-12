import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

import prisma from "@/lib/client";
import { LoginProps } from "@/lib/zod";
import { Status, User } from "@prisma/client";

import { SessionData, sessionOptions } from "../session-options";

export const createUser = async (
  data: Omit<User, "id" | "createdAt" | "updatedAt">,
) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { userId: data.userId }],
      },
    });

    if (existingUser) {
      return {
        status: 409,
        message: "User already exists!",
      };
    }

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        userId: data.userId,
        email: data.email,
        password: data.password,
        status: data.status,
        phone: data.phone,
        ...(data.roleId && { role: { connect: { id: data.roleId } } }),
        ...(data.image && { image: data.image }),
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.email,
      subject: "Verify Your Email",
      html: `
        <p>Thank you for registering. You can login with email or user id.</p>
        <p>User Email - ${data.email}</p>
        <p>User ID - ${data.userId}</p>
        <p>Password - ${data.password}</p>
      `,
    };

    // TODO: send email feature
    // await transporter.sendMail(mailOptions);

    return {
      status: 201,
      message: "Created!",
      data: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const loginUser = async (data: LoginProps) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.userId }, { userId: data.userId }],
      },
    });

    if (!user) {
      return {
        status: 401,
        message: "Invalid email or password!",
      };
    }

    if (user.status !== Status.ACTIVE) {
      return {
        status: 401,
        message: "Admin was banned!",
      };
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      return { status: 401, message: "Your password is wrong!" };
    }

    const token = jwt.sign(
      { id: user.id, userId: user.userId, email: user.email },
      process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string,
    );

    return {
      status: 200,
      message: "Success!",
      data: {
        token,
        user,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    if (!session.adminToken) {
      return {
        status: 401,
        message: "Unauthorized, token not found!",
      };
    }
    const decoded = jwt.verify(
      session.adminToken,
      process.env.NEXT_PUBLIC_JWT_SECRET_KEY as string,
    ) as {
      userId: string;
      id: string;
      email: string;
    };
    const userId = decoded.userId;

    const data = await prisma.user.findUnique({
      where: { userId, status: Status.ACTIVE },
      include: { role: true },
    });
    return {
      status: 200,
      message: "Success!",
      data,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
