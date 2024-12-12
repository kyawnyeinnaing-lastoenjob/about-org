import { SubCategory } from "@prisma/client";

import { Country } from "../country/types";

export interface CategoryResponse {
  status: number;
  message: string;
  data: CategoryData[];
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  categoryImage: string;
  status: string;
  isDeleted: boolean;
  sortingNumber: number;
  createdById: string;
  countryId: string;
  createdAt: string;
  updatedAt: string;
  SubCategory: SubCategory[];
  country: Country;
}

export interface Count {
  Listing: number;
}
