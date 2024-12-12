import prisma from "@/lib/client";

// Get dashboard data
export const getDashboard = async () => {
  try {
    const countryCount = await prisma.country.count({
      where: {
        isDeleted: false,
      },
    });
    const mainCategoryCount = await prisma.mainCategory.count({
      where: {
        isDeleted: false,
      },
    });
    const subCategoryCount = await prisma.subCategory.count({
      where: {
        isDeleted: false,
      },
    });
    const listingCount = await prisma.listing.count({
      where: {
        isDeleted: false,
      },
    });
    return {
      status: 200,
      message: "Data fetched successfully!",
      data: {
        countryCount,
        mainCategoryCount,
        subCategoryCount,
        listingCount,
      },
    };
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};
