import prisma from "@/lib/client";
import { MainCategory, Status } from "@prisma/client";

import { Sorting } from "../enum";

import { getUser } from "./auth";

// Create a new MainCategory
export const createMainCategory = async (
  data: Omit<MainCategory, "id" | "createdAt" | "updatedAt" | "createdById">,
) => {
  try {
    const existingMainCategory = await prisma.mainCategory.findFirst({
      where: {
        name: data.name,
        countryId: data.countryId,
      },
    });

    if (existingMainCategory) {
      return {
        status: 409,
        message: "A mainCategory with this name  already exists.",
      };
    }

    const newMainCategory = await prisma.mainCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        status: data.status,
        sortingNumber: data.sortingNumber,
        isDeleted: data.isDeleted,
        ...(data.categoryImage && {
          categoryImage: data.categoryImage,
        }),
        ...(data.countryId && {
          country: {
            connect: {
              id: data.countryId,
            },
          },
        }),
      },
    });

    return {
      status: 201,
      message: "Created!",
      data: newMainCategory,
    };
  } catch (error) {
    console.error("Error creating mainCategory:", error);
    throw error;
  }
};

// get mainCategory sorting number
export const getMainCategorySortingNumber = async () => {
  try {
    const number = await prisma.mainCategory.findFirst({
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
export const swapMainCategorySortingNumber = async (
  id1: string,
  id2: string,
) => {
  try {
    const data1 = await prisma.mainCategory.findUnique({
      where: { id: id1 },
      select: {
        sortingNumber: true,
      },
    });
    const data2 = await prisma.mainCategory.findUnique({
      where: { id: id2 },
      select: {
        sortingNumber: true,
      },
    });
    const updatedMainCategory = await prisma.mainCategory.update({
      where: { id: id1 },
      data: {
        sortingNumber: data2?.sortingNumber,
      },
    });
    const updatedMainCategory2 = await prisma.mainCategory.update({
      where: { id: id2 },
      data: {
        sortingNumber: data1?.sortingNumber,
      },
    });
    return {
      status: 200,
      message: "Swap Sorting Number Successfully!",
      data: [updatedMainCategory, updatedMainCategory2],
    };
  } catch (error) {
    console.error("Error swapping sorting number:", error);
    throw error;
  }
};

// Read a MainCategory by ID
export const getMainCategoryById = async (id: string) => {
  try {
    const mainCategory = await prisma.mainCategory.findUnique({
      where: { id },
      include: {
        country: true,
      },
    });
    return mainCategory;
  } catch (error) {
    console.error("Error fetching mainCategory:", error);
    throw error;
  }
};

// Read a MainCategory by Slug
export const getMainCategoryBySlug = async (slug: string) => {
  try {
    const mainCategory = await prisma.mainCategory.findUnique({
      where: { slug, isDeleted: false, status: Status.ACTIVE },
      include: {
        country: true,
      },
    });
    return mainCategory;
  } catch (error) {
    console.error("Error fetching mainCategory:", error);
    throw error;
  }
};

// Update a MainCategory by ID
export const updateMainCategory = async (
  id: string,
  data: Partial<Omit<MainCategory, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const existingMainCategory = await prisma.mainCategory.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });

    if (existingMainCategory) {
      return {
        status: 409,
        message: "A mainCategory with this name already exists.",
      };
    }

    const updatedMainCategory = await prisma.mainCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        status: data.status,
        sortingNumber: data.sortingNumber,
        isDeleted: data.isDeleted,
        ...(data.categoryImage && {
          categoryImage: data.categoryImage,
        }),
      },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedMainCategory,
    };
  } catch (error) {
    console.error("Error updating mainCategory:", error);
    throw error;
  }
};

// Update many MainCategory by ID
export const restoreMultipleMainCategories = async (
  updates: {
    id: string;
    isDeleted: boolean;
  }[],
) => {
  try {
    const updatedMainCategories = await Promise.all(
      updates.map(async (update) => {
        return await prisma.mainCategory.update({
          where: { id: update.id },
          data: { isDeleted: update.isDeleted },
        });
      }),
    );

    return {
      status: 200,
      message: "Restored all data",
      data: updatedMainCategories,
    };
  } catch (error) {
    console.error("Error updating MainCategories:", error);
    throw error;
  }
};

// Restore a MainCategory by ID
export const restoreMainCategory = async (
  id: string,
  data: Partial<Omit<MainCategory, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const updatedMainCategory = await prisma.mainCategory.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      status: 200,
      message: "Restored!",
      data: updatedMainCategory,
    };
  } catch (error) {
    console.error("Error updating mainCategory:", error);
    throw error;
  }
};

const hasSubCategory = async (id: string) => {
  const country = await prisma.mainCategory.findFirst({
    where: { id },
    include: { SubCategory: true },
  });
  return country?.SubCategory?.length;
};

// Soft delete a MainCategory by ID
export const softDeleteMainCategory = async (id: string) => {
  try {
    if (await hasSubCategory(id)) {
      return {
        success: false,
        status: 400,
        message: "Category with sub category cannnot be deleted",
      };
    }

    await prisma.mainCategory.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      success: true,
      status: 204,
      message: "Deleted!",
    };
  } catch (error) {
    console.error("Error marking mainCategory as deleted:", error);
    throw error;
  }
};

// Hard delete a MainCategory by ID
export const deleteMainCategory = async (id: string) => {
  try {
    if (await hasSubCategory(id)) {
      return {
        success: false,
        status: 400,
        message: "Category with sub category cannot be deleted",
      };
    }

    await prisma.mainCategory.delete({
      where: { id },
    });
    return {
      success: true,
      status: 204,
      message: "Delete forever!",
    };
  } catch (error) {
    console.error("Error deleting mainCategory:", error);
    throw error;
  }
};

export const getLastSubCategory = async () => {
  try {
    const data = await prisma.subCategory.findMany({
      where: { isDeleted: false, status: Status.ACTIVE },
      take: 10,
      include: { Listing: true },
    });

    return {
      status: 200,
      message: "Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching SubCategory with most Listings:", error);
    throw error;
  }
};

// Get all MainCategories
export const getAllMainCategories = async () => {
  try {
    const user = await getUser();
    const data = await prisma.mainCategory.findMany({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
      },
      include: {
        SubCategory: {
          include: {
            _count: {
              select: {
                Listing: true,
              },
            },
          },
        },
        country: true,
      },
      orderBy: {
        sortingNumber: Sorting.ASC,
      },
    });

    return {
      status: 200,
      message: "Data fetched Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching MainCategories:", error);
    throw error;
  }
};

// get unique slug name
export const findExistingCategoryName = async (
  name: string,
  sortingNumber: number,
): Promise<{ data: string }> => {
  try {
    const existingCategory = await prisma.mainCategory.findFirst({
      where: { name },
    });

    const slug = existingCategory
      ? existingCategory?.name
          ?.toLowerCase()
          .replace(/[\p{P}\p{S}\p{Z}]+/gu, "-") +
        "-" +
        sortingNumber
      : name?.toLowerCase().replace(/[\p{P}\p{S}\p{Z}]+/gu, "-");

    return {
      data: slug,
    };
  } catch (error) {
    console.error("Error fetching MainCategories:", error);
    throw new Error("Failed to fetch existing main category name.");
  }
};

// Get all Categories and Sub-Categories by country
export const getAllCategoriesByCountry = async (slug: string) => {
  try {
    // const user = await getUser();
    const data = await prisma.mainCategory.findMany({
      where: {
        // ...(!user.data && { status: Status.ACTIVE }),
        status: Status.ACTIVE,
        isDeleted: false,
        country: { slug },
      },
      orderBy: {
        sortingNumber: Sorting.ASC,
      },
      include: {
        SubCategory: {
          where: {
            status: Status.ACTIVE,
            isDeleted: false,
            country: { slug },
          },
          include: {
            _count: {
              select: {
                Listing: {
                  where: {
                    status: Status.ACTIVE,
                    isDeleted: false,
                  },
                },
              },
            },
          },
          orderBy: {
            sortingNumber: Sorting.ASC,
          },
        },
        country: true,
      },
    });

    // const filteredData = data
    //   .map((mainCategory) => ({
    //     ...mainCategory,
    //     SubCategory: mainCategory.SubCategory.filter((subCategory) => subCategory._count.Listing > 0),
    //   }))
    //   .filter((mainCategory) => mainCategory.SubCategory.length > 0);

    return {
      status: 200,
      message: "Data fetched Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching MainCategories:", error);
    throw error;
  }
};

// Get bin MainCategories
export const getBinMainCategories = async () => {
  try {
    const user = await getUser();
    const mainCategories = await prisma.mainCategory.findMany({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: true,
      },
      include: {
        country: true,
      },
      orderBy: {
        sortingNumber: Sorting.ASC,
      },
    });

    return {
      status: 200,
      message: "Successfully!",
      data: mainCategories,
    };
  } catch (error) {
    console.error("Error fetching mainCategories:", error);
    throw error;
  }
};
