import { User } from "@prisma/client";

import prisma from "../client";

export const getUsers = async () => {
  try {
    const user = await prisma.user.findMany({
      where: { role: { roleName: { startsWith: "User" } } },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        role: true,
      },
    });

    return {
      data: user,
      message: "Successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const updatedUser = await prisma.user.findFirst({
      where: { id },
      include: { role: true },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateUser = async (
  id: string,
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "roleId">>,
) => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            userId: data.userId,
            email: data.email,
            phone: data.phone,
          },
        ],
        NOT: { id },
      },
    });

    if (existingUser) {
      return {
        status: 409,
        message: "A User with this userId , email and phone already exists.",
      };
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
