export type Params = {
  page?: number;
  limit?: number;
  skip?: number;
  dateSorting?: string;
  keyword?: string;
  search?: string;
};

export type SearchData = {
  slug: string;
  countrySlug: string;
  categorySlug: string;
  subCategorySlug: string;
  title: string;
  imgUrl: string;
}[];
