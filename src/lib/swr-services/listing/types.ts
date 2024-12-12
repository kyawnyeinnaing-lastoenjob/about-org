import { Country, MainCategory, Status, SubCategory } from "@prisma/client";

import { Meta } from "../subCategory/type";

export interface ListingBySubCategoryResponse {
  status: number;
  message: string;
  data: ListData[];
  pagination: Pagination;
  meta: {
    mainCategory: CategoryMetaData;
    subCategory: CategoryMetaData;
  };
}

export interface ListDetailResponse {
  status: number;
  message: string;
  data: ListData;
}

export interface CategoryMetaData {
  id: string;
  name: string;
  slug: string;
}

export interface ListData {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  detailImage: string | null;
  subCategoryId: string;
  mainCategoryId: string;
  countryId: string;
  status: string;
  isDeleted: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  mainCategory: MainCategory;
  subCategory: SubCategory;
  country: Country;
  shareHashTag: string | null;
  shareTitle: string | null;
  shareDescription: string | null;
  shareToFacebook: Status;
  shareToViber: Status;
  shareToTelegram: Status;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
}

export interface ListingResponse {
  status: number;
  message: string;
  data: ListData[];
  pagination: Pagination;
}

export interface ListingPaginationResponse {
  message: string;
  meta: Meta;
  pagination: Pagination;
  status: number;
  data: ListData[];
}
