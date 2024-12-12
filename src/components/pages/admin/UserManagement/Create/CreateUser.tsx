"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Layout from "@/components/layout/admin";
import ImageUpload from "@/components/shared/themes/ui/ImageUpload";
import { IOSSwitch } from "@/components/shared/themes/ui/styles";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useUserMutation } from "@/lib/swr-services/user-management";
import { UserProps, userSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { Button, FormLabel, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Status } from "@prisma/client";

const CreateUser: React.FC = () => {
  const router = useRouter();
  const [checked, setChecked] = useState<boolean>(true);
  const [imgUrl, setImgUrl] = useState<string>("");

  const breadcrumbs = [
    {
      title: "Create User",
      link: null,
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProps>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      userId: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const { openSnackbar } = useSnackbar();

  const { trigger: createTrigger, isMutating } = useUserMutation();

  const onSubmit: SubmitHandler<UserProps> = async (data) => {
    const dataToSend: UserProps = {
      ...data,
      status: checked ? Status.ACTIVE : Status.INACTIVE,
      image: imgUrl,
    };

    await createTrigger(dataToSend, {
      onSuccess: (res) => {
        openSnackbar(res?.data?.message, "success");
        router.push(`/admin/user-management`);
      },
      onError: (err) => {
        const { message } = err?.response?.data;
        openSnackbar(message, "error");
      },
    });
  };

  return (
    <Layout title="Create User" breadcrumbs={breadcrumbs}>
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
                loading={isMutating}
              >
                <AddIcon sx={{ mr: "5px" }} />
                Create
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Layout>
  );
};

export default CreateUser;
