import prisma from "@/lib/client";
import { Listing, Prisma, Status } from "@prisma/client";

import { Sorting } from "../enum";

import { getUser } from "./auth";

// Create a new Listing
export const createListing = async (
  data: Omit<Listing, "id" | "createdAt" | "updatedAt" | "createdById">,
) => {
  try {
    const existingListing = await prisma.listing.findFirst({
      where: {
        title: data.title,
        countryId: data.countryId,
        mainCategoryId: data.mainCategoryId,
        subCategoryId: data.subCategoryId,
      },
    });

    if (existingListing) {
      return {
        status: 409,
        message: "A listing with this title already exists.",
      };
    }

    const newListing = await prisma.listing.create({
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        slug: data.slug,
        status: data.status,
        sortingNumber: data.sortingNumber,
        isDeleted: false,
        shareToFacebook: data.shareToFacebook,
        shareToViber: data.shareToViber,
        shareToTelegram: data.shareToTelegram,
        ...(data.shareHashTag && {
          shareHashTag: data.shareHashTag,
        }),
        ...(data.shareTitle && {
          shareTitle: data.shareTitle,
        }),
        ...(data.shareDescription && {
          shareDescription: data.shareDescription,
        }),
        ...(data.detailImage && {
          detailImage: data.detailImage,
        }),
        ...(data.subCategoryId && {
          subCategory: { connect: { id: data.subCategoryId } },
        }),
        mainCategory: {
          connect: {
            id: data.mainCategoryId!,
          },
        },
        country: {
          connect: {
            id: data.countryId!,
          },
        },
      },
    });
    return {
      status: 201,
      message: "Created!",
      data: newListing,
    };
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
};

// get listing sorting number
export const getListingSortingNumber = async () => {
  try {
    const number = await prisma.listing.findFirst({
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

// Swap the sorting number of two listings
export const swapListingSortingNumber = async (id1: string, id2: string) => {
  try {
    const data1 = await prisma.listing.findUnique({
      where: { id: id1 },
      select: {
        sortingNumber: true,
      },
    });
    const data2 = await prisma.listing.findUnique({
      where: { id: id2 },
      select: {
        sortingNumber: true,
      },
    });
    const updatedListing = await prisma.listing.update({
      where: { id: id1 },
      data: {
        sortingNumber: data2?.sortingNumber,
      },
    });
    const updatedListing2 = await prisma.listing.update({
      where: { id: id2 },
      data: {
        sortingNumber: data1?.sortingNumber,
      },
    });
    return {
      status: 200,
      message: "Swap Sorting Number Successfully!",
      data: [updatedListing, updatedListing2],
    };
  } catch (error) {
    console.error("Error swapping sorting number:", error);
    throw error;
  }
};

// Read a Listing by ID
export const getListingBySlug = async (id: string) => {
  try {
    const data = await prisma.listing.findUnique({
      where: { id },
      include: {
        mainCategory: true,
        subCategory: true,
        country: true,
      },
    });
    return {
      status: 200,
      message: "Data fetched successfully!",
      data,
      seo: {
        meta: {
          slug: data?.slug,
          title: data?.title,
          description: data?.shortDescription,
          url: data?.detailImage,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

// Read a Listing by ID
export const getListByIdWithCountry = async (id: string, country: string) => {
  try {
    const data = await prisma.listing.findUnique({
      where: { id, country: { slug: country } },
    });
    return !!data;
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

export const getListByCountry = async (id: string, countrySlug: string) => {
  try {
    const user = await getUser();
    const data = await prisma.listing.findUnique({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        //? Old flow was rescheduled with slug and id
        //? The reason is that the slug name is getting too long
        // slug: listSlug,
        id,
        country: { slug: countrySlug },
      },
      include: {
        country: true,
        mainCategory: true,
        subCategory: true,
      },
    });
    return {
      status: 200,
      message: "Data fetched successfully!",
      data,
      seo: {
        meta: {
          slug: data?.slug,
          title: data?.title,
          description: data?.shortDescription,
          url: data?.detailImage,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching listing:", error);
    throw error;
  }
};

// Update a Listing by ID
export const updateListing = async (
  id: string,
  data: Partial<Omit<Listing, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const existingListing = await prisma.listing.findFirst({
      where: {
        title: data.title,
        countryId: data.countryId,
        mainCategoryId: data.mainCategoryId,
        subCategoryId: data.subCategoryId,
        NOT: { id },
      },
    });

    if (existingListing) {
      return {
        status: 409,
        message: "A listing with this title already exists.",
      };
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        slug: data.slug,
        status: data.status,
        shareToFacebook: data.shareToFacebook,
        shareToViber: data.shareToViber,
        shareToTelegram: data.shareToTelegram,
        ...(data.detailImage && {
          detailImage: data.detailImage,
        }),
        ...(data.subCategoryId && {
          subCategory: { connect: { id: data.subCategoryId } },
        }),
        ...(data.mainCategoryId && {
          mainCategory: {
            connect: {
              id: data.mainCategoryId!,
            },
          },
        }),
        ...(data.shareHashTag && {
          shareHashTag: data.shareHashTag,
        }),
        ...(data.shareTitle && {
          shareTitle: data.shareTitle,
        }),
        ...(data.shareDescription && {
          shareDescription: data.shareDescription,
        }),
        country: {
          connect: {
            id: data.countryId!,
          },
        },
      },
    });

    return {
      status: 200,
      message: "Updated!",
      data: updatedListing,
    };
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

// Update many Listing by ID
export const restoreMultipleListings = async (
  updates: {
    id: string;
    isDeleted: boolean;
  }[],
) => {
  try {
    const updatedListings = await Promise.all(
      updates.map(async (update) => {
        return await prisma.listing.update({
          where: { id: update.id },
          data: { isDeleted: update.isDeleted },
        });
      }),
    );

    return {
      status: 200,
      message: "Restored all data",
      data: updatedListings,
    };
  } catch (error) {
    console.error("Error updating listings:", error);
    throw error;
  }
};

// Restore a Listing by ID
export const restoreListing = async (
  id: string,
  data: Partial<Omit<Listing, "id" | "createdAt" | "updatedAt">>,
) => {
  try {
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        isDeleted: data.isDeleted,
      },
    });

    return {
      status: 200,
      message: "Restored!",
      data: updatedListing,
    };
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
};

// Soft delete a Listing by ID
export const softDeleteListing = async (id: string) => {
  try {
    await prisma.listing.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      status: 204,
      message: "Deleted!",
    };
  } catch (error) {
    console.error("Error marking listing as deleted:", error);
    throw error;
  }
};

// Hard delete a Listing by ID
export const deleteListing = async (id: string) => {
  try {
    await prisma.listing.delete({
      where: { id },
    });
    return {
      status: 204,
      message: "Delete forever!",
    };
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
};

// Get all Listings
export const getAllListings = async (
  skip: number,
  limit: number,
  dateSorting: string,
  keyword: string,
  search: string,
  slug?: string,
) => {
  try {
    const user = await getUser();
    const totalCount = await prisma.listing.count({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
        title: { contains: search, mode: "insensitive" },
        ...(slug && {
          OR: [
            { country: { slug } },
            { mainCategory: { slug } },
            { subCategory: { slug } },
          ],
        }),
      },
    });

    const data = await prisma.listing.findMany({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
        title: { contains: search, mode: "insensitive" },
        ...(slug && {
          OR: [
            { country: { slug } },
            { mainCategory: { slug } },
            { subCategory: { slug } },
          ],
        }),
      },
      orderBy: {
        sortingNumber: "desc",
      },
      // orderBy: [
      //   ...(dateSorting != null ? [{ createdAt: dateSorting }] : []),
      //   ...(keyword != null ? [{ title: keyword }] : []),
      // ],
      include: {
        mainCategory: true,
        subCategory: true,
        country: true,
      },
      skip,
      take: limit,
    });

    return {
      status: 200,
      message: "Data fetched successfully!",
      data,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

type ListingsByCountrySlug = {
  params: {
    skip: number;
    limit: number;
    dateSorting?: string;
    keyword?: string;
    search?: string;
  };
  slugs: {
    mainCateSlug?: string;
    subCateSlug?: string;
    countrySlug: string;
  };
};

export const getAllListingsBySubCateSlugAndCountrySlug = async ({
  params,
  slugs,
}: ListingsByCountrySlug) => {
  try {
    // const user = await getUser();
    const totalCount = await prisma.listing.count({
      where: {
        // ...(!user.data && { status: Status.ACTIVE }),
        status: Status.ACTIVE,
        isDeleted: false,
        title: { contains: params.search, mode: "insensitive" },
        subCategory: { slug: slugs.subCateSlug },
        country: { slug: slugs.countrySlug },
      },
    });

    const data = await prisma.listing.findMany({
      where: {
        // ...(!user.data && { status: Status.ACTIVE }),
        status: Status.ACTIVE,
        isDeleted: false,
        title: { contains: params.search, mode: "insensitive" },
        subCategory: {
          slug: slugs.subCateSlug,
        },
        country: {
          slug: slugs.countrySlug,
        },
      },
      orderBy: [
        // ...(params.keyword != 'null'
        //   ? [{ title: params.keyword as Prisma.SortOrder }]
        //   : [{ createdAt: Sorting.DESC as Prisma.SortOrder }]),
        ...(params.dateSorting != "null"
          ? [{ createdAt: params.dateSorting as Prisma.SortOrder }]
          : [{ createdAt: Sorting.DESC as Prisma.SortOrder }]),
      ],
      include: {
        mainCategory: true,
        subCategory: true,
        country: true,
      },
      skip: params.skip,
      take: params.limit,
    });

    return {
      status: 200,
      message: "Data fetched successfully!",
      data,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

export const getAllListingsByMainCateSlugAndCountrySlug = async ({
  params,
  slugs,
}: ListingsByCountrySlug) => {
  try {
    const user = await getUser();
    const totalCount = await prisma.listing.count({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
        title: { contains: params.search, mode: "insensitive" },
        mainCategory: { slug: slugs.mainCateSlug },
        country: { slug: slugs.countrySlug },
      },
    });

    const data = await prisma.listing.findMany({
      where: {
        ...(!user.data && { status: Status.ACTIVE }),
        isDeleted: false,
        title: { contains: params.search, mode: "insensitive" },
        mainCategory: { slug: slugs.mainCateSlug },
        country: { slug: slugs.countrySlug },
      },
      orderBy: [
        // ...(params.keyword != 'null'
        //   ? [
        //       {
        //         title:
        //           params.keyword === Sorting.ASC ? ('asc' as Prisma.SortOrder) : ('desc' as Prisma.SortOrder),
        //       },
        //     ]
        //   : [{ createdAt: 'desc' as Prisma.SortOrder }]),
        ...(params.dateSorting != "null"
          ? [
              {
                createdAt:
                  params.dateSorting === Sorting.ASC
                    ? ("asc" as Prisma.SortOrder)
                    : ("desc" as Prisma.SortOrder),
              },
            ]
          : [
              {
                createdAt: Sorting.DESC as Prisma.SortOrder,
              },
            ]),
      ],
      include: {
        mainCategory: true,
        subCategory: true,
        country: true,
      },
      skip: params.skip,
      take: params.limit,
    });

    return {
      status: 200,
      message: "Data fetched successfully!",
      data,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};

export const getMetaByCountrySlug = async (slug: string) => {
  try {
    const data = await prisma.country.findFirst({
      where: {
        slug,
      },
      select: { id: true, name: true, slug: true },
    });

    if (!data) {
      return {
        country: { id: "", name: "", slug: "" },
      };
    }

    return {
      country: {
        id: data.id,
        name: data.name,
        slug: data.slug,
      },
    };
  } catch (error) {
    console.error("Error fetching listings meta:", error);
    throw error;
  }
};

export const getMetaByMainCatSlug = async (slug: string) => {
  try {
    const data = await prisma.mainCategory.findFirst({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!data || !data.country) {
      return {
        country: { id: "", name: "", slug: "" },
        mainCategory: { id: "", name: "", slug: "" },
        subCategory: { id: "", name: "", slug: "" },
      };
    }

    return {
      country: {
        id: data.country.id,
        name: data.country.name,
        slug: data.country.slug,
      },
      mainCategory: {
        id: data.id,
        name: data.name,
        slug: data.slug,
      },
      subCategory: { id: "", name: "", slug: "" },
    };
  } catch (error) {
    console.error("Error fetching listings meta:", error);
    throw error;
  }
};

export const getMetaBySubCatSlug = async (slug: string) => {
  try {
    const data = await prisma.subCategory.findFirst({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        mainCategory: { select: { id: true, name: true, slug: true } },
        country: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!data || !data.country || !data.mainCategory) {
      return {
        country: { id: "", name: "", slug: "" },
        mainCategory: { id: "", name: "", slug: "" },
        subCategory: { id: "", name: "", slug: "" },
      };
    }

    return {
      country: {
        id: data.country.id,
        name: data.country.name,
        slug: data.country.slug,
      },
      mainCategory: {
        id: data.mainCategory.id,
        name: data.mainCategory.name,
        slug: data.mainCategory.slug,
      },
      subCategory: { id: data.id, name: data.name, slug: data.slug },
    };
  } catch (error) {
    console.error("Error fetching listings meta:", error);
    throw error;
  }
};

export const getBinListings = async () => {
  try {
    const listings = await prisma.listing.findMany({
      where: { isDeleted: true },
      include: {
        country: true,
        mainCategory: true,
        subCategory: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return {
      status: 200,
      message: "Successfully!",
      data: listings,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};
