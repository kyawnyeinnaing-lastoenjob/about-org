import prisma from "@/lib/client";
import { Status, SubCategory } from "@prisma/client";

import { Sorting } from "../enum";

import { getUser } from "./auth";

// Create a new SubCategory
export const createSubCategory = async (
  data: Omit<SubCategory, "id" | "createdAt" | "updatedAt" | "createdById">,
) => {
  try {
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        name: data.name,
        countryId: data.countryId,
        mainCategoryId: data.mainCategoryId,
      },
    });

    if (existingSubCategory) {
      return {
        status: 409,
        message: "A subCategory with this name already exists.",
      };
    }

    const newSubCategory = await prisma.subCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        status: data.status,
        sortingNumber: data.sortingNumber,
        isDeleted: data.isDeleted,
        ...(data.subCategoryImage && {
          subCategoryImage: data.subCategoryImage,
        }),
        ...(data.mainCategoryId && {
          mainCategory: {
            connect: {
              id: data.mainCategoryId,
            },
          },
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
      data: newSubCategory,
    };
  } catch (error) {
    console.error("Error creating subCategory:", error);
    throw error;
  }
};

// get SubCategory sorting number
export const getSubCategorySortingNumber = async () => {
  try {
    const number = await prisma.subCategory.findFirst({
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
export const swapSubCategorySortingNumber = async (
  id1: string,
  id2: string,
) => {
  try {
    const data1 = await prisma.subCategory.findUnique({
      where: { id: id1 },
      select: {
        sortingNumber: true,
      },
    });
    const data2 = await prisma.subCategory.findUnique({
      where: { id: id2 },
      select: {
        sortingNumber: true,
      },
    });
    const updatedSubCategory = await prisma.subCategory.update({
      where: { id: id1 },
      data: {
        sortingNumber: data2?.sortingNumber,
      },
    });
    const updatedSubCategory2 = await prisma.subCategory.update({
      where: { id: id2 },
      data: {
        sortingNumber: data1?.sortingNumber,
      },
    });
    return {
      status: 200,
      message: "Swap Sorting Number Successfully!",
      data: [updatedSubCategory, updatedSubCategory2],
    };
  } catch (error) {
    console.error("Error swapping sorting number:", error);
    throw error;
  }
};

// Read a SubCategory by slug
export const getSubCategoryBySlug = async (slug: string) => {
  try {
    const user = await getUser();
    const data = await prisma.subCategory.findUnique({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        slug,
        isDeleted: false,
      },
    });
    return {
      slug: data?.slug,
      title: data?.name,
      url: data?.subCategoryImage,
    };
  } catch (error) {
    console.error("Error fetching subCategory:", error);
    throw error;
  }
};

// check sub category by slug
export const checkSubCategoryBySlug = async (slug: string) => {
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { slug, isDeleted: false, status: Status.ACTIVE },
      include: {
        country: true,
        Listing: true,
      },
    });
    return subCategory;
  } catch (error) {
    console.error("Error fetching subCategory:", error);
    throw error;
  }
};

// Update a SubCategory by ID
export const updateSubCategory = async (
  id: string,
  data: Partial<Omit<SubCategory, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const existingSubCategory = await prisma.subCategory.findFirst({
      where: {
        OR: [
          {
            name: data.name,
          },
        ],
        NOT: { id },
      },
    });

    if (existingSubCategory) {
      return {
        status: 409,
        message: "A subCategory with this name already exists.",
      };
    }

    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        status: data.status,
        sortingNumber: data.sortingNumber,
        isDeleted: data.isDeleted,
        ...(data.subCategoryImage && {
          subCategoryImage: data.subCategoryImage,
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
      status: 200,
      message: "Updated!",
      data: updatedSubCategory,
    };
  } catch (error) {
    console.error("Error updating subCategory:", error);
    throw error;
  }
};

// Update many SubCategory by ID
export const restoreMultipleSubCategories = async (
  updates: {
    id: string;
    isDeleted: boolean;
  }[],
) => {
  try {
    const updatedSubCategories = await Promise.all(
      updates.map(async (update) => {
        return await prisma.subCategory.update({
          where: { id: update.id },
          data: { isDeleted: update.isDeleted },
        });
      }),
    );

    return {
      status: 200,
      message: "Restored all data",
      data: updatedSubCategories,
    };
  } catch (error) {
    console.error("Error updating SubCategories:", error);
    throw error;
  }
};

// Restore a SubCategory by ID
export const restoreSubCategory = async (
  id: string,
  data: Partial<Omit<SubCategory, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const updatedSubCategory = await prisma.subCategory.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return {
      status: 200,
      message: "Restored!",
      data: updatedSubCategory,
    };
  } catch (error) {
    console.error("Error updating subCategory:", error);
    throw error;
  }
};

const hasListing = async (id: string) => {
  const country = await prisma.subCategory.findFirst({
    where: { id },
    include: { Listing: true },
  });
  return country?.Listing?.length;
};

// Soft delete a SubCategory by ID
export const softDeleteSubCategory = async (id: string) => {
  try {
    if (await hasListing(id)) {
      return {
        success: false,
        status: 400,
        message: "Sub Category with listing cannnot be deleted",
      };
    }

    await prisma.subCategory.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      success: true,
      status: 204,
      message: "Deleted!",
    };
  } catch (error) {
    console.error("Error marking subCategory as deleted:", error);
    throw error;
  }
};

// Hard delete a SubCategory by ID
export const deleteSubCategory = async (id: string) => {
  try {
    if (await hasListing(id)) {
      return {
        success: false,
        status: 400,
        message: "Sub Category with listing cannnot be deleted",
      };
    }

    await prisma.subCategory.delete({
      where: { id },
    });
    return {
      success: true,
      status: 204,
      message: "Delete forever!",
    };
  } catch (error) {
    console.error("Error deleting subCategory:", error);
    throw error;
  }
};

// Get all SubCategories
export const getAllSubCategories = async () => {
  try {
    const user = await getUser();
    const data = await prisma.subCategory.findMany({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
      },
      orderBy: {
        sortingNumber: "asc",
      },
      include: {
        mainCategory: true,
        country: true,
      },
    });

    return {
      status: 200,
      message: "Data fetched Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching SubCategories:", error);
    throw error;
  }
};

// get unique slug name
export const findExistingSubCategoryName = async (
  name: string,
  sortingNumber: number,
): Promise<{ data: string }> => {
  try {
    const existingCategory = await prisma.subCategory.findFirst({
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
    console.error("Error fetching SubMainCategories:", error);
    throw new Error("Failed to fetch existing sub category name.");
  }
};

// Get all SubCategories by main category
export const getAllSubCategoriesByMainCategory = async (
  country: string,
  mainCat: string,
) => {
  try {
    // const user = await getUser();
    const data = await prisma.subCategory.findMany({
      where: {
        // ...(!user.data && { status: Status.ACTIVE }),
        status: Status.ACTIVE,
        isDeleted: false,
        mainCategory: { slug: mainCat },
        country: { slug: country },
      },
      orderBy: {
        sortingNumber: Sorting.ASC,
      },
      include: {
        mainCategory: true,
        Listing: true,
        country: true,
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
    });

    // const filteredData = data.filter((subCategory) => subCategory._count.Listing > 0);

    return {
      status: 200,
      message: "Data fetched Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching SubCategories:", error);
    throw error;
  }
};

// Get all SubCategories by country
export const getAllSubCategoriesByCountry = async (slug: string) => {
  try {
    const user = await getUser();
    const data = await prisma.subCategory.findMany({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
        country: { slug },
      },
      orderBy: {
        sortingNumber: Sorting.ASC,
      },
      include: {
        country: true,
      },
    });

    return {
      status: 200,
      message: "Data fetched Successfully!",
      data,
    };
  } catch (error) {
    console.error("Error fetching SubCategories:", error);
    throw error;
  }
};

// Get bin SubCategories
export const getBinSubCategories = async () => {
  try {
    const subCategories = await prisma.subCategory.findMany({
      where: { isDeleted: true },
      include: {
        country: true,
        mainCategory: true,
      },
      orderBy: {
        sortingNumber: Sorting.ASC,
      },
    });

    return {
      status: 200,
      message: "Successfully!",
      data: subCategories,
    };
  } catch (error) {
    console.error("Error fetching subCategories:", error);
    throw error;
  }
};

// Read a subCategory by ID
export const getSubCategoryById = async (id: string) => {
  try {
    const subCategory = await prisma.subCategory.findUnique({
      where: { id },
      include: {
        country: true,
      },
    });
    return subCategory;
  } catch (error) {
    console.error("Error fetching subCategory:", error);
    throw error;
  }
};
