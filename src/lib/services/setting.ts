import { Setting } from "@prisma/client";

import prisma from "../client";

export const getSettings = async () => {
  try {
    const setting = await prisma.setting.findMany();

    return {
      data: setting,
      message: "Successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching setting:", error);
    throw error;
  }
};

export const createSetting = async (
  data: Omit<Setting, "id" | "createdAt" | "updatedAt" | "createdById">,
) => {
  try {
    console.log("data => ", data);
    const newSetting = await prisma.setting.create({
      data,
    });

    return {
      status: 200,
      message: "Created!",
      data: newSetting,
    };
  } catch (error) {
    console.error("Error create setting:", error);
    throw error;
  }
};

export const updateSetting = async (
  id: string,
  data: Partial<Omit<Setting, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const updatedSetting = await prisma.setting.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedSetting,
    };
  } catch (error) {
    console.error("Error updating setting:", error);
    throw error;
  }
};
