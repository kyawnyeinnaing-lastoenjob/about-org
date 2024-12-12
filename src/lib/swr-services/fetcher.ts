import appAxios from "./axios";

export const fetcher = (url: string) =>
  appAxios.get(url).then((res) => res.data);
