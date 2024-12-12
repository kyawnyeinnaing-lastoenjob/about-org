import { About } from "@prisma/client";

import prisma from "../client";
import { AboutProps } from "../zod";

export const getAbout = async () => {
  try {
    const about = await prisma.about.findMany();
    return {
      data: about,
      message: "Successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching about:", error);
    throw error;
  }
};

export const createAbout = async (data: AboutProps) => {
  try {
    const newAbout = await prisma.about.create({
      data: {
        description: data.description,
        image: data?.image || "",
        slogan: data?.slogan || "",
      },
    });
    return {
      status: 201,
      message: "Created!",
      data: newAbout,
    };
  } catch (error) {
    console.log("error => ", error);
    throw error;
  }
};

export const updateAbout = async (
  id: string,
  data: Partial<Omit<About, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const updatedAbout = await prisma.about.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedAbout,
    };
  } catch (error) {
    console.error("Error updating about:", error);
    throw error;
  }
};
