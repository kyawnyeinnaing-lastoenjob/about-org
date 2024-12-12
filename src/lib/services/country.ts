import prisma from "@/lib/client";
import { Country, Status } from "@prisma/client";

// Create a new Country
export const createCountry = async (
  data: Omit<Country, "id" | "createdAt" | "updatedAt" | "createdById">,
) => {
  try {
    const existingCountry = await prisma.country.findFirst({
      where: {
        OR: [
          {
            name: data.name,
          },
          { countryCode: data.countryCode },
        ],
      },
    });

    if (existingCountry) {
      return {
        status: 409,
        message: "A country with this name , country code already exists.",
      };
    }

    const newCountry = await prisma.country.create({
      data: {
        name: data.name,
        slug: data.slug,
        countryCode: data.countryCode,
        status: data.status,
        sortingNumber: data.sortingNumber,
        isDeleted: data.isDeleted,
        flag: data.flag,
      },
    });
    return {
      status: 201,
      message: "Created!",
      data: newCountry,
    };
  } catch (error) {
    console.error("Error creating country:", error);
    throw error;
  }
};

// get country sorting number
export const getCountrySortingNumber = async () => {
  try {
    const number = await prisma.country.findFirst({
      select: {
        sortingNumber: true,
      },
      orderBy: {
        sortingNumber: "desc",
      },
    });
    return number ? number.sortingNumber + 1 : 1;
  } catch (error) {
    console.error("Error fetching sorting number:", error);
    throw error;
  }
};

// Swap the sorting number of two countries
export const swapCountrySortingNumber = async (id1: string, id2: string) => {
  try {
    const data1 = await prisma.country.findUnique({
      where: { id: id1 },
      select: {
        sortingNumber: true,
      },
    });
    const data2 = await prisma.country.findUnique({
      where: { id: id2 },
      select: {
        sortingNumber: true,
      },
    });
    const updatedCountry = await prisma.country.update({
      where: { id: id1 },
      data: {
        sortingNumber: data2?.sortingNumber,
      },
    });
    const updatedCountry2 = await prisma.country.update({
      where: { id: id2 },
      data: {
        sortingNumber: data1?.sortingNumber,
      },
    });
    return {
      status: 200,
      message: "Swap Sorting Number Successfully!",
      data: [updatedCountry, updatedCountry2],
    };
  } catch (error) {
    console.error("Error swapping sorting number:", error);
    throw error;
  }
};

// Read a Country by ID
export const getCountryById = async (id: string) => {
  try {
    const country = await prisma.country.findUnique({
      where: { id },
    });
    return country;
  } catch (error) {
    console.error("Error fetching country:", error);
    throw error;
  }
};

// Update a Country by ID
export const updateCountry = async (
  id: string,
  data: Partial<Omit<Country, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const existingCountry = await prisma.country.findFirst({
      where: {
        OR: [
          {
            name: data.name,
          },
          { countryCode: data.countryCode },
        ],
        NOT: { id },
      },
    });

    if (existingCountry) {
      return {
        status: 409,
        message: "A country with this name , country code already exists.",
      };
    }

    const updatedCountry = await prisma.country.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        countryCode: data.countryCode,
        status: data.status,
        isDeleted: data.isDeleted,
        ...(data.flag && {
          flag: data.flag,
        }),
      },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedCountry,
    };
  } catch (error) {
    console.error("Error updating country:", error);
    throw error;
  }
};

// Update many Country by ID
export const restoreMultipleCountries = async (
  updates: {
    id: string;
    isDeleted: boolean;
  }[],
) => {
  try {
    const updatedCountries = await Promise.all(
      updates.map(async (update) => {
        return await prisma.country.update({
          where: { id: update.id },
          data: { isDeleted: update.isDeleted },
        });
      }),
    );

    return {
      status: 200,
      message: "Restored all data",
      data: updatedCountries,
    };
  } catch (error) {
    console.error("Error updating countries:", error);
    throw error;
  }
};

// Restore a Country by ID
export const restoreCountry = async (
  id: string,
  data: Partial<Omit<Country, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const updatedCountry = await prisma.country.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      status: 200,
      message: "Restored!",
      data: updatedCountry,
    };
  } catch (error) {
    console.error("Error updating country:", error);
    throw error;
  }
};

const hasMainCategory = async (id: string) => {
  const country = await prisma.country.findFirst({
    where: { id },
    include: { MainCategory: true },
  });
  return country?.MainCategory?.length;
};

// Soft delete a Country by ID
export const softDeleteCountry = async (id: string) => {
  try {
    if (await hasMainCategory(id)) {
      return {
        success: false,
        status: 400,
        message: "Country with child category cannot be deleted",
      };
    }

    await prisma.country.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      success: true,
      status: 204,
      message: "Deleted!",
    };
  } catch (error) {
    console.error("Error marking country as deleted:", error);
    throw error;
  }
};

// Hard delete a Country by ID
export const deleteCountry = async (id: string) => {
  try {
    if (await hasMainCategory(id)) {
      return {
        success: false,
        status: 400,
        message: "Country with child category cannot be deleted",
      };
    }
    await prisma.country.delete({
      where: { id },
    });
    return {
      success: true,
      status: 204,
      message: "Delete forever!",
    };
  } catch (error) {
    console.error("Error deleting country:", error);
    throw error;
  }
};

// Get all Countries
export const getAllCountries = async () => {
  try {
    const data = await prisma.country.findMany({
      where: { isDeleted: false },
      include: {
        _count: {
          select: {
            MainCategory: {
              where: {
                status: Status.ACTIVE,
                isDeleted: false,
              },
            },
            SubCategory: {
              where: {
                status: Status.ACTIVE,
                isDeleted: false,
              },
            },
          },
        },
      },
      orderBy: {
        sortingNumber: "asc",
      },
    });

    return {
      status: 200,
      message: "Data fetched Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

// Get bin countries
export const getBinCountries = async () => {
  try {
    const countries = await prisma.country.findMany({
      where: { isDeleted: true },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      status: 200,
      message: "Successfully!",
      data: countries,
    };
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};
