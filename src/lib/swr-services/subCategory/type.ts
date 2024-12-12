import { Country, MainCategory } from "@prisma/client";

export interface SubCategoryResponse {
  status: number;
  message: string;
  meta: Meta;
  data: SubCategoryData[];
}

export interface Meta {
  country: CountryMeta;
  mainCategory: MainCategoryMeta;
  subCategory: SubCategoryMeta;
}

export interface CountryMeta {
  id: string;
  name: string;
  slug: string;
}

export interface MainCategoryMeta {
  id: string;
  name: string;
  slug: string;
}

export interface SubCategoryMeta {
  id: string;
  name: string;
  slug: string;
}

export interface SubCategoryData {
  id: string;
  name: string;
  slug: string;
  subCategoryImage?: string;
  status: string;
  isDeleted: boolean;
  sortingNumber: number;
  mainCategoryId: string;
  countryId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  mainCategory: MainCategory;
  country: Country;
  _count: Count;
}

export interface Count {
  Listing: number;
}
