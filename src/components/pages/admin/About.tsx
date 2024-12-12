"use client";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Layout from "@/components/layout/admin";
import ImageUpload from "@/components/shared/themes/ui/ImageUpload";
import RTEEditor from "@/components/shared/themes/ui/TextEditor";
// import RTEEditor from '@/components/shared/themes/ui/TextEditor';
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useAboutMutation,
  useGetAbout,
  useUpdateAbout,
} from "@/lib/swr-services/about";
import { AboutProps, aboutUsSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { FormLabel, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";

const About: React.FC = () => {
  const [imgUrl, setImgUrl] = useState<string>("");
  const breadcrumbs = [
    {
      title: "About",
      link: null,
    },
  ];

  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm<AboutProps>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: {
      description: "",
      image: "",
    },
  });
  const { openSnackbar } = useSnackbar();

  // api
  const { data: aboutData } = useGetAbout();
  const { trigger: createTrigger, isMutating } = useAboutMutation();
  const { trigger: updateTrigger, isMutating: updateMutating } =
    useUpdateAbout();

  const onSubmit: SubmitHandler<AboutProps> = async (data) => {
    if (aboutData) {
      await updateTrigger(
        {
          data: {
            description: data?.description,
            image: imgUrl,
            slogan: data?.slogan,
          },
          id: aboutData?.data?.id,
        },
        {
          onSuccess: (res) => {
            openSnackbar(res?.data?.message, "success");
          },
        },
      );
    } else {
      await createTrigger(
        {
          description: data.description,
          image: imgUrl,
          slogan: data?.slogan,
        },
        {
          onSuccess: (res) => {
            openSnackbar(res?.data?.message, "success");
          },
        },
      );
    }
  };

  useEffect(() => {
    setValue("slogan", aboutData?.data?.slogan ?? "");
    setValue("description", aboutData?.data?.description ?? "Default desc");
    setImgUrl(aboutData?.data?.image ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aboutData]);

  return (
    <Layout title="About" breadcrumbs={breadcrumbs}>
      <Stack component="form">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Slogan
            </FormLabel>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    slotProps={{
                      htmlInput: {
                        maxLength: 100,
                      },
                    }}
                    helperText={`${field?.value?.length}/${100}`}
                    {...field}
                    multiline
                    rows={4}
                  />
                );
              }}
              name="slogan"
            />
          </Grid>
          <Grid size={{ xs: 12 }} display="none">
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Upload About Image
            </FormLabel>
            <ImageUpload
              label="Choose Image"
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
            />
          </Grid>
          <Grid size={{ xs: 12 }} display="none">
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              About Description
            </FormLabel>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <RTEEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    error={!!errors.description}
                    helperText={errors?.description?.message || ""}
                    height="350px"
                  />
                );
              }}
              name="description"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              {/* <Button
                variant="outlined"
                onClick={() =>
                  reset({
                    slogan: '',
                    description: '',
                    image: '',
                  })
                }
              >
                Cancel
              </Button> */}

              {aboutData ? (
                <LoadingButton
                  variant="contained"
                  sx={{ width: "150px" }}
                  onClick={handleSubmit(onSubmit)}
                  loading={updateMutating}
                >
                  <AddIcon sx={{ mr: "5px" }} />
                  Update
                </LoadingButton>
              ) : (
                <LoadingButton
                  variant="contained"
                  sx={{ width: "150px" }}
                  onClick={handleSubmit(onSubmit)}
                  loading={isMutating}
                >
                  <AddIcon sx={{ mr: "5px" }} />
                  Create
                </LoadingButton>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Layout>
  );
};

export default About;
