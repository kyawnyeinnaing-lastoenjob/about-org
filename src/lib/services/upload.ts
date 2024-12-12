import useSWRMutation from "swr/mutation";

import appAxios from "../swr-services/axios";

type UploadImageProps = {
  arg: {
    formData: FormData;
  };
};

export interface UploadImageResponse {
  data: {
    status: number;
    message: string;
    url: string;
  };
}

export const useUploadImage = () =>
  useSWRMutation(`/upload`, async (url, { arg }: UploadImageProps) => {
    const res = await appAxios.post<UploadImageResponse>(url, arg.formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      message: res?.data?.data?.message,
      url: res?.data?.data?.url,
    };
  });
