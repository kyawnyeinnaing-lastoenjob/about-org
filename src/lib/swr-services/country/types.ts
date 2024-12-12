import { Status } from "@prisma/client";

import { SubCategoryData } from "../subCategory/type";

export interface CountryResponse {
  status: number;
  message: string;
  data: Country[];
}

export interface CategoryByCountryResponse {
  status: number;
  message: string;
  data: CategoryByCountry[];
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  status: Status;
  isDeleted: boolean;
  sortingNumber: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  flag: string;
  categoryCount: number;
  subCategoryCount: number;
}

export interface CategoryByCountry {
  id: string;
  name: string;
  slug: string;
  categoryImage: string;
  status: Status;
  isDeleted: boolean;
  sortingNumber: number;
  createdById: string | null;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  SubCategory: SubCategoryData[];
}
