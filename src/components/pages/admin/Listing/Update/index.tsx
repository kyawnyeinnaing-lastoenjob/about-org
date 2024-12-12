"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import Layout from "@/components/layout/admin";
import ImageUpload from "@/components/shared/themes/ui/ImageUpload";
import { IOSSwitch } from "@/components/shared/themes/ui/styles";
import RTEEditor from "@/components/shared/themes/ui/TextEditor";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useGetCategoriesByCountry,
  useGetCountries,
} from "@/lib/swr-services/country";
import { useUpdateList } from "@/lib/swr-services/listing";
import { useGetListByCountrySlug } from "@/lib/swr-services/listing";
import { useGetSubCategoryByMainCategory } from "@/lib/swr-services/subCategory";
import { ListingProps, listingSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Status } from "@prisma/client";

const updateListingSchema = listingSchema.extend({
  countryId: z.string().optional(),
  mainCategoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
  shareHashTag: z.string().optional(),
  shareTitle: z.string().optional(),
  shareDescription: z.string().optional(),
  shareToFacebook: z.nativeEnum(Status).optional(),
  shareToViber: z.nativeEnum(Status).optional(),
  shareToTelegram: z.nativeEnum(Status).optional(),
});

interface Props {
  id: string;
  country: string;
}

const UpdateListingItem: React.FC<Props> = ({ id, country }) => {
  const router = useRouter();

  const { openSnackbar } = useSnackbar();
  const [checked, setChecked] = useState<boolean>(true);
  const [checkedFb, setCheckedFb] = useState<boolean>(true);
  const [checkedVb, setCheckedVb] = useState<boolean>(true);
  const [checkedTg, setCheckedTg] = useState<boolean>(true);
  const [detailImgUrl, setDetailImgUrl] = useState<string>("");
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [subCategorySelected, setSubCategorySelected] = useState<string>("");

  const { data: userData } = useGetListByCountrySlug({
    listSlug: id as string,
    countrySlug: country as string,
  });

  const { data: countries = [] } = useGetCountries();

  const { data: categories = [] } = useGetCategoriesByCountry({
    country:
      countries?.find((item) => item.id === countrySelected)?.slug ?? "null",
  });

  const { data: subCategories } = useGetSubCategoryByMainCategory({
    country:
      countries?.find((item) => item.id === countrySelected)?.slug ?? "null",
    mainCategory:
      categories?.find((item) => item.id === categorySelected)?.slug ?? "null",
  });

  const { trigger: updateTrigger, isMutating } = useUpdateList();

  const breadcrumbs = [
    {
      title: "Update List",
      link: null,
    },
  ];

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingProps>({
    resolver: zodResolver(updateListingSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      shareHashTag: "",
      shareTitle: "",
      shareDescription: "",
    },
  });

  useEffect(() => {
    setValue("title", userData?.data?.title ?? "");
    setValue("shortDescription", userData?.data?.shortDescription ?? "");
    setValue("description", userData?.data?.description ?? "");
    setValue("shareHashTag", userData?.data?.shareHashTag ?? "");
    setValue("shareTitle", userData?.data?.shareTitle ?? "");
    setValue("shareDescription", userData?.data?.shareDescription ?? "");
    setCountrySelected(userData?.data?.countryId ?? "");
    setCategorySelected(userData?.data?.mainCategoryId ?? "");
    setSubCategorySelected(userData?.data?.subCategoryId ?? "");
    setDetailImgUrl(userData?.data?.detailImage ?? "");
    setChecked(userData?.data?.status === Status.ACTIVE);
    setCheckedFb(userData?.data?.shareToFacebook === Status.ACTIVE);
    setCheckedVb(userData?.data?.shareToViber === Status.ACTIVE);
    setCheckedTg(userData?.data?.shareToTelegram === Status.ACTIVE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const onSubmit: SubmitHandler<ListingProps> = async (data) => {
    const dataToSend: ListingProps = {
      ...data,
      status: checked ? Status.ACTIVE : Status.INACTIVE,
      detailImage: detailImgUrl,
      countryId: countrySelected,
      mainCategoryId: categorySelected,
      subCategoryId: subCategorySelected,
      shareToFacebook: checkedFb ? Status.ACTIVE : Status.INACTIVE,
      shareToViber: checkedVb ? Status.ACTIVE : Status.INACTIVE,
      shareToTelegram: checkedTg ? Status.ACTIVE : Status.INACTIVE,
    };

    await updateTrigger(
      {
        data: dataToSend,
        id: userData?.data?.id as string,
      },
      {
        onSuccess: (res) => {
          openSnackbar(res?.data?.message, "success");
          router.push(`/admin/listing`);
        },
      },
    );
  };

  return (
    <Layout title="Update List" breadcrumbs={breadcrumbs}>
      <Stack component="form">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Title
            </FormLabel>
            <Controller
              name="title"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    placeholder="Enter title"
                    error={!!errors.title}
                    helperText={errors?.title?.message || ""}
                    {...field}
                  />
                );
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Country
            </FormLabel>
            <Select
              sx={{
                width: "100%",
              }}
              disabled={true}
              value={countrySelected}
              onChange={(e) => setCountrySelected(e?.target?.value as string)}
            >
              {countries?.length > 0 ? (
                countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name} - {country.countryCode}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>
                  <Link href="/admin/country">No country found!</Link>
                </MenuItem>
              )}
            </Select>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Category
            </FormLabel>
            <Select
              sx={{
                width: "100%",
              }}
              disabled={true}
              value={categorySelected}
              onChange={(e) => setCategorySelected(e?.target?.value as string)}
            >
              {categories?.length > 0 ? (
                categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>
                  <Link href="/admin/category">No category found!</Link>
                </MenuItem>
              )}
            </Select>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Sub Category
            </FormLabel>
            <Select
              sx={{
                width: "100%",
              }}
              disabled={true}
              value={subCategorySelected}
              onChange={(e) =>
                setSubCategorySelected(e?.target?.value as string)
              }
            >
              {subCategories?.data && subCategories?.data?.length ? (
                subCategories?.data?.map((subCategory) => (
                  <MenuItem key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem>
                  <Link href="/admin/sub-category">No Sub Category found!</Link>
                </MenuItem>
              )}
            </Select>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Short Description
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
                        maxLength: 200,
                      },
                    }}
                    helperText={`${field.value.length}/${200}`}
                    multiline
                    rows={4}
                    placeholder="Write short description"
                    {...field}
                  />
                );
              }}
              name="shortDescription"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Description
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
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Facebook Social Share Hashtag
            </FormLabel>
            <Controller
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    slotProps={{
                      htmlInput: {
                        maxLength: 200,
                      },
                    }}
                    helperText={`${field.value?.length || 0}/${200}`}
                    {...field}
                    multiline
                    placeholder="Write facebook social share hashtag"
                    rows={4}
                  />
                );
              }}
              name="shareHashTag"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Social Share Title
            </FormLabel>
            <Controller
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: "100%" }}
                    slotProps={{
                      htmlInput: {
                        maxLength: 200,
                      },
                    }}
                    helperText={`${field.value?.length || 0}/${200}`}
                    {...field}
                    multiline
                    placeholder="Write social share title"
                    rows={4}
                  />
                );
              }}
              name="shareTitle"
            />
          </Grid>

          {/* <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: 'block' }}>
              Social Share Description
            </FormLabel>
            <Controller
              control={control}
              render={({ field }) => {
                return (
                  <TextField
                    sx={{ width: '100%' }}
                    slotProps={{
                      htmlInput: {
                        maxLength: 200,
                      },
                    }}
                    helperText={`${field.value?.length || 0}/${200}`}
                    {...field}
                    multiline
                    placeholder="Write Social Share Description"
                    rows={4}
                  />
                );
              }}
              name="shareDescription"
            />
          </Grid> */}

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }} required>
              Detail Image{" "}
              <Typography component="span" fontStyle="italic">
                [Aspect Ration (1 : 1) recommended / Max - 2 MB]
              </Typography>
            </FormLabel>
            <ImageUpload
              label="Choose Detail Image"
              imgUrl={detailImgUrl}
              setImgUrl={setDetailImgUrl}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Share to FaceBook
            </FormLabel>

            <IOSSwitch
              sx={{ m: 1 }}
              checked={checkedFb}
              onChange={(event) => {
                setCheckedFb(event.target.checked);
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Share to Viber
            </FormLabel>

            <IOSSwitch
              sx={{ m: 1 }}
              checked={checkedVb}
              onChange={(event) => {
                setCheckedVb(event.target.checked);
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel htmlFor="address1" sx={{ display: "block" }}>
              Share to Telegram
            </FormLabel>

            <IOSSwitch
              sx={{ m: 1 }}
              checked={checkedTg}
              onChange={(event) => {
                setCheckedTg(event.target.checked);
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
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
              <Link href="/admin/listing">
                <Button variant="outlined">Cancel</Button>
              </Link>

              <LoadingButton
                variant="contained"
                sx={{ width: "150px" }}
                onClick={handleSubmit(onSubmit)}
                loading={isMutating}
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

export default UpdateListingItem;
