"use client";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_ShowHideColumnsButton,
  MRT_TableOptions,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  // type MRT_Row,
  // type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import Image from "next/image";
import Link from "next/link";

import FileUpload from "@/components/shared/FileUpload";
import { fontSize } from "@/components/shared/themes/fontStyles";
import {
  IOSSwitch,
  TableWrapStyled,
} from "@/components/shared/themes/ui/styles";
import { useDialog } from "@/hooks/useDialog";
import { useSnackbar } from "@/hooks/useSnackbar";
// import { useGetCategories } from '@/lib/swr-services/category';
import {
  useGetCategoriesByCountry,
  useGetCountries,
} from "@/lib/swr-services/country";
import {
  useDeleteSubCategory,
  useGetBinSubCategory,
  useGetSubCategories,
  useSubCategoryMutation,
  useUpdateSubCategory,
  useUpdateSubCategorySortNumber,
} from "@/lib/swr-services/subCategory";
import { SubCategoryData } from "@/lib/swr-services/subCategory/type";
import {
  SubCategoryProps,
  subCategorySchema,
  SwapSortNumberProps,
  swapSortNumberSchema,
} from "@/lib/zod";
import { validateData } from "@/utils/validations";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  // InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Status } from "@prisma/client";

const SubCategoryTable: React.FC = () => {
  const [checked, setChecked] = useState<boolean>(true);
  const [countrySelected, setCountrySelected] = useState<string>("");
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");

  const [getSelectedId, setGetSelectedId] = useState<{
    countryId: string;
    categoryId: string;
  }>();
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    townshipCode?: string;
    mainCategoryId?: string;
    countryId?: string;
  } | null>();
  const [responseErrorMsg, setResponseErrorMsg] = useState<string>();

  const { openSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const theme = useTheme();
  // api
  const {
    data: countries = [],
    error: countryError,
    isLoading: countriesLoading,
  } = useGetCountries();

  // const { data: categories = [], error: categoryError, isLoading: categoriesLoading } = useGetCategories();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoryError,
  } = useGetCategoriesByCountry({
    country:
      countries?.find((item) => item.id === countrySelected)?.slug ?? "null",
  });

  const {
    data: subCategories = [],
    error: subCategoryError,
    isLoading: subCategoryLoading,
    isValidating: subCategoryValidating,
    mutate: subCategoryMutate,
  } = useGetSubCategories();

  const { data: binSubCategories = [], mutate: binMutate } =
    useGetBinSubCategory({
      revalidateOnFocus: true,
    });

  const {
    trigger: createSubCategory,
    error: createError,
    isMutating: subCategoryMutating,
  } = useSubCategoryMutation();

  const {
    trigger: updateTrigger,
    isMutating: updateMutating,
    error: updateError,
  } = useUpdateSubCategory();

  const {
    trigger: deleteTrigger,
    isMutating: deleteMutating,
    error: deleteError,
  } = useDeleteSubCategory();

  const {
    trigger: swapTrigger,
    isMutating: swapMutating,
    error: swapError,
  } = useUpdateSubCategorySortNumber();

  // create action
  const handleCreate: MRT_TableOptions<SubCategoryData>["onCreatingRowSave"] =
    async ({ values, table }) => {
      const newData: SubCategoryProps = {
        ...values,
        status: checked ? Status.ACTIVE : Status.INACTIVE,
        countryId: countrySelected as string,
        mainCategoryId: categorySelected as string,
        subCategoryImage: imgUrl,
      };

      const errors = await validateData(subCategorySchema, newData);
      if (errors) {
        setValidationErrors(errors);
        return;
      }

      await createSubCategory(newData, {
        onSuccess: (res) => {
          openSnackbar(res?.data?.message, "success");
          table.setCreatingRow(null);
        },
        onError: (err) => {
          const { message } = err?.response.data.data;
          setResponseErrorMsg(message);
          table.setEditingRow(null);
        },
      });
    };

  // update action
  const handleUpdate: MRT_TableOptions<SubCategoryData>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const newData: SubCategoryProps = {
        ...values,
        status: checked ? Status.ACTIVE : Status.INACTIVE,
        countryId: (countrySelected || getSelectedId?.countryId) as string,
        mainCategoryId: categorySelected as string,
        subCategoryImage: imgUrl,
      };

      const errors = await validateData(subCategorySchema, newData);

      if (errors) {
        setValidationErrors(errors);
        return;
      }
      await updateTrigger(
        { data: newData, id: row?.original?.id },
        {
          onSuccess: (res) => {
            openSnackbar(res?.data?.message, "success");
            table.setEditingRow(null);
          },
        },
      );
    };

  // swap action
  const handleSwapSortNumber = async (id1: string, id2: string) => {
    const newData: SwapSortNumberProps = { id1, id2 };

    const errors = await validateData(swapSortNumberSchema, newData);

    if (errors) {
      setValidationErrors(errors);
      return;
    }
    await swapTrigger(
      { data: newData },
      {
        onSuccess: (res) => {
          closeDialog();
          openSnackbar(res?.data?.message, "success");
        },
      },
    );
  };

  // soft delete action
  const handleSoftDelete = (id: string) => {
    deleteTrigger(
      { id },
      {
        onSuccess: (res) => {
          closeDialog();
          openSnackbar(res?.data?.message, "info");

          // fetch bin api
          binMutate();
        },
      },
    );
  };

  // hard delete action
  const handleHardDelete = (id: string) => {
    deleteTrigger(
      { id, hardDelete: true },
      {
        onSuccess: (res) => {
          closeDialog();
          openSnackbar(res?.data?.message, "warning");
        },
      },
    );
  };

  const handleOpenDialog = (id: string, type?: "SOFT" | "HARD") => {
    openDialog({
      title: "Confirmation",
      content: "Are you sure you want to proceed?",
      actions: () => (
        <>
          <Button onClick={closeDialog} variant="text">
            Cancel
          </Button>
          {type === "SOFT" ? (
            <LoadingButton
              variant="outlined"
              onClick={() => handleSoftDelete(id)}
              loading={deleteMutating}
              autoFocus
            >
              Soft Delete
            </LoadingButton>
          ) : (
            <LoadingButton
              variant="outlined"
              onClick={() => handleHardDelete(id)}
              loading={deleteMutating}
              autoFocus
            >
              Delete Forever
            </LoadingButton>
          )}
        </>
      ),
    });
  };

  const columns = useMemo<MRT_ColumnDef<SubCategoryData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Sub Category Name",
        enableSorting: false,
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          variant: "outlined",
          label: null,
          placeholder: "Sub Category Name",
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () => {
            setValidationErrors((prev) => ({
              ...prev,
              name: undefined,
            }));
          },
        },
        Cell: ({ row }) => {
          return (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-start"
              spacing={2}
            >
              {row?.original?.subCategoryImage ? (
                <Box
                  width={40}
                  height={40}
                  sx={{ overflow: "hidden", borderRadius: theme.spacing(2) }}
                >
                  <Image
                    width={40}
                    height={40}
                    alt=""
                    src={row?.original?.subCategoryImage}
                  />
                </Box>
              ) : (
                <Image
                  src="/uploads/images/default/sub-category.svg"
                  alt="sub-category"
                  width={40}
                  height={40}
                  style={{ borderRadius: theme.spacing(2) }}
                />
              )}
              <Typography align="left">{row?.original?.name}</Typography>
            </Stack>
          );
        },
      },
      {
        accessorKey: "countryId",
        header: "Country",
        enableSorting: false,
        editVariant: "select",
        enableColumnFilter: false,
        // editSelectOptions: countries,
        muiEditTextFieldProps: {
          required: true,
          variant: "outlined",
          label: null,
          error: !!validationErrors?.countryId,
          helperText: validationErrors?.countryId,
        },
        Cell: ({ row }) => {
          return (
            <Typography align="left">
              {row?.original?.country?.name || "-"}
            </Typography>
          );
        },
        Edit: ({ row }) => {
          return (
            <FormControl>
              <label id="demo-simple-select-label">Select Country</label>
              <Select
                sx={{ width: "100%" }}
                defaultValue={row?.original?.countryId}
                onChange={(e) => setCountrySelected(e?.target?.value as string)}
              >
                {countries?.length > 0 ? (
                  countries
                    .filter((country) => country.status === Status.ACTIVE)
                    .map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.name} - {country.countryCode}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem>
                    <Link href="/country">No country found!</Link>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          );
        },
      },
      {
        accessorKey: "mainCategoryId",
        header: "Category",
        enableSorting: false,
        editVariant: "select",
        enableColumnFilter: false,
        // editSelectOptions: countries,
        muiEditTextFieldProps: {
          required: true,
          variant: "outlined",
          label: null,
          error: !!validationErrors?.mainCategoryId,
          helperText: validationErrors?.mainCategoryId,
        },
        Cell: ({ row }) => {
          return (
            <Typography align="left">
              {row?.original?.mainCategory?.name || "-"}
            </Typography>
          );
        },
        Edit: ({ row }) => {
          return (
            <FormControl>
              <label id="demo-simple-select-label">Select Category</label>
              <Select
                sx={{
                  width: "100%",
                }}
                defaultValue={row?.original?.mainCategoryId}
                onChange={(e) =>
                  setCategorySelected(e?.target?.value as string)
                }
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
            </FormControl>
          );
        },
      },
      {
        accessorKey: "status",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Status",
        Cell: ({ row }) => {
          return row?.original?.status === Status.ACTIVE ? (
            <Chip variant="filled" label="Active" color="success" />
          ) : (
            <Chip variant="filled" label="InActive" color="error" />
          );
        },
        Edit: ({ row }) => {
          return (
            <FormControlLabel
              control={
                !row?.original?.status ? (
                  <IOSSwitch
                    sx={{ m: 1 }}
                    checked={checked}
                    onChange={(event) => {
                      setChecked(event.target.checked);
                    }}
                  />
                ) : (
                  <IOSSwitch
                    sx={{ m: 1 }}
                    defaultChecked={row?.original?.status === Status.ACTIVE}
                    checked={checked}
                    onChange={(event) => {
                      setChecked(event.target.checked);
                    }}
                  />
                )
              }
              label={"Status"}
            />
          );
        },
      },
    ],
    [checked, validationErrors, countries, categories],
  );

  const table = useMaterialReactTable({
    columns,
    data: subCategories,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    rowNumberDisplayMode: "original",

    positionCreatingRow: "top",
    positionActionsColumn: "last",

    enableEditing: true,
    enableRowNumbers: true,
    enableTopToolbar: true,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enableRowOrdering: true,

    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    muiTopToolbarProps: {
      className: "table-top-toolbar-wrap",
    },
    muiToolbarAlertBannerProps:
      countryError || categoryError || createError
        ? {
            color: "error",
            children: (
              <>
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    width: "50%",
                    boxShadow: "none",
                  }}
                >
                  {responseErrorMsg}
                </Alert>
              </>
            ),
            variant: "filled",
          }
        : undefined,
    muiRowDragHandleProps: ({}) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (
          draggingRow &&
          hoveredRow &&
          draggingRow.original &&
          hoveredRow.original
        ) {
          handleSwapSortNumber(draggingRow.original.id, hoveredRow.original.id);
        }
      },
    }),

    // onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreate,
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdate,

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "6px" }}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              table.setEditingRow(row);
              setCountrySelected(row?.original?.country?.id);
              setCategorySelected(row?.original?.mainCategoryId);
              setChecked(row?.original?.status === Status.ACTIVE);
              setGetSelectedId({
                countryId: row.original.countryId,
                categoryId: row.original.mainCategoryId,
              });
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Soft Delete">
          <IconButton
            color="error"
            onClick={() => handleOpenDialog(row?.original?.id, "SOFT")}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Forever">
          <IconButton
            color="error"
            onClick={() => handleOpenDialog(row?.original?.id, "HARD")}
          >
            <DeleteForeverIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          variant="caption"
          sx={{
            fontSize: fontSize.md,
          }}
          align="center"
        >
          Create New Sub Category
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
          <FileUpload imgUrl={imgUrl} setImgUrl={setImgUrl} />
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
          }}
        >
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
      return (
        <>
          <DialogTitle
            variant="caption"
            sx={{
              fontSize: fontSize.md,
            }}
            align="center"
          >
            Edit Sub Category
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {internalEditComponents}
            <FileUpload
              imgUrl={imgUrl}
              initialUrl={row?.original?.subCategoryImage}
              setImgUrl={setImgUrl}
            />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
            }}
          >
            <MRT_EditActionButtons variant="text" table={table} row={row} />
          </DialogActions>
        </>
      );
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Stack
        direction="row"
        justifyContent="flex-start"
        flexWrap="wrap"
        spacing={1}
      >
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <Tooltip title="Refetch">
          <IconButton onClick={() => subCategoryMutate()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {binSubCategories?.length > 0 && (
          <Link href="/admin/sub-category/bin">
            <Tooltip title="Bin">
              <IconButton>
                <AutoDeleteIcon />
              </IconButton>
            </Tooltip>
          </Link>
        )}
        <MRT_ToggleGlobalFilterButton table={table} />
        {/* <MRT_GlobalFilterT  extField table={table} /> */}
      </Stack>
    ),
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create New Sub Category
        </Button>
      </Box>
    ),

    state: {
      isLoading: countriesLoading || categoriesLoading || subCategoryLoading,
      isSaving:
        subCategoryMutating || updateMutating || deleteMutating || swapMutating,
      showAlertBanner:
        countryError ||
        categoryError ||
        subCategoryError ||
        createError ||
        updateError ||
        deleteError ||
        swapError,
      showProgressBars:
        countriesLoading || categoriesLoading || subCategoryLoading,
      showSkeletons: subCategoryValidating,
    },
  });

  return (
    <Stack spacing={2}>
      <TableWrapStyled>
        <MaterialReactTable table={table} />
      </TableWrapStyled>
    </Stack>
  );
};

export default SubCategoryTable;
