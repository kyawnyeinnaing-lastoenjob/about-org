import { Sorting } from "../enum";

export function parseQueryParams(url: string) {
  const { searchParams } = new URL(url);

  const parseIntOrDefault = (param: string | null, defaultValue: number) =>
    parseInt(param ?? "") || defaultValue;

  const page = parseIntOrDefault(searchParams.get("page"), 1);
  const limit = parseIntOrDefault(searchParams.get("limit"), 10);
  const skip = (page - 1) * limit;
  const dateSorting =
    searchParams.get("dateSorting") === "null"
      ? "null"
      : searchParams.get("dateSorting") === Sorting.ASC
        ? Sorting.ASC
        : Sorting.DESC;
  const keyword =
    searchParams.get("keyword") === "null"
      ? "null"
      : searchParams.get("keyword") === Sorting.ASC
        ? Sorting.ASC
        : Sorting.DESC;
  const search = searchParams.get("search") ?? "";

  return { page, limit, skip, dateSorting, keyword, search };
}
