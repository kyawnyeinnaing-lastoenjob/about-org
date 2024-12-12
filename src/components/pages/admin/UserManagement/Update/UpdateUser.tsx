"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Layout from "@/components/layout/admin";
import ImageUpload from "@/components/shared/themes/ui/ImageUpload";
import { IOSSwitch } from "@/components/shared/themes/ui/styles";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useGetUserDetailById,
  useUpdateUser,
} from "@/lib/swr-services/user-management";
import { UserProps, userSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { Button, FormLabel, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Status } from "@prisma/client";

interface PagePros {
  id: string;
}

const UpdateUser: React.FC<PagePros> = ({ id }) => {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(true);
  const [imgUrl, setImgUrl] = useState<string>("");
  const { openSnackbar } = useSnackbar();

  const { data: userData } = useGetUserDetailById({ id });
  const { trigger: updateTrigger, isMutating: updateMutating } =
    useUpdateUser();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserProps>({
    resolver: zodResolver(
      userSchema.extend({
        password: z.string().optional(),
      }),
    ),
    defaultValues: {
      name: "",
      userId: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const breadcrumbs = [
    {
      title: "Edit User",
      link: null,
    },
  ];

  useEffect(() => {
    setValue("name", userData?.name ?? "");
    setValue("userId", userData?.userId ?? "");
    setValue("email", userData?.email ?? "");
    setValue("phone", userData?.phone ?? "");
    setImgUrl(userData?.image ?? "");
    setChecked(userData?.status === Status.ACTIVE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit: SubmitHandler<UserProps> = async (data) => {
    const dataToSend: UserProps = {
      ...data,
      status: checked ? Status.ACTIVE : Status.INACTIVE,
      image: imgUrl,
    };

    await updateTrigger(
      {
        data: dataToSend,
        id: id,
      },
      {
        onSuccess: (res) => {
          openSnackbar(res?.data?.message, "success");
          router.push(`/admin/user-management`);
        },
      },
    );
  };

  return (
    <Layout title="Edit User" breadcrumbs={breadcrumbs}>
      <Stack component="form">
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              User Name
            </FormLabel>
            <Controller
              name="name"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    error={!!errors.name}
                    helperText={errors?.name?.message || ""}
                    {...field}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              User ID
            </FormLabel>
            <Controller
              name="userId"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    error={!!errors.userId}
                    helperText={errors?.userId?.message || ""}
                    {...field}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Email
            </FormLabel>
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    error={!!errors.email}
                    helperText={errors?.email?.message || ""}
                    type="email"
                    {...field}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Password
            </FormLabel>
            <Controller
              name="password"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    error={!!errors.password}
                    helperText={errors?.password?.message || ""}
                    {...field}
                  />
                );
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Phone
            </FormLabel>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    error={!!errors.phone}
                    helperText={errors?.phone?.message || ""}
                    type="phone"
                    {...field}
                  />
                );
              }}
            />
          </Grid>
          {/* <Grid size={{ xs: 6 }}>
          <FormLabel htmlFor="address1" sx={{ display: 'block' }}>
            Role
          </FormLabel>
          <Controller
            name="roleId"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return (
                <TextField
                  sx={{ width: '100%' }}
                  error={!!errors.roleId}
                  helperText={errors?.roleId?.message || ''}
                  {...field}
                />
              );
            }}
          />
        </Grid> */}
          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Upload Profile Image
            </FormLabel>
            <ImageUpload
              label="Choose Image"
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Status
            </FormLabel>

            <IOSSwitch
              sx={{ m: 1 }}
              checked={checked}
              onChange={(event) => {
                setChecked(event.target.checked);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <Link href="/admin/user-management">
                <Button variant="outlined">Cancel</Button>
              </Link>

              <LoadingButton
                variant="contained"
                sx={{ width: "150px" }}
                onClick={handleSubmit(onSubmit)}
                loading={updateMutating}
              >
                <AddIcon sx={{ mr: "5px" }} />
                Update
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Layout>
  );
};

export default UpdateUser;
