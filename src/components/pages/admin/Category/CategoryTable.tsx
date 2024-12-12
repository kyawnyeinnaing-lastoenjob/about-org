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
import {
  useCategoryMutation,
  useDeleteCategory,
  useGetBinCategory,
  useGetCategories,
  useUpdateCategory,
  useUpdateMainCategorySortNumber,
} from "@/lib/swr-services/category";
import { CategoryData } from "@/lib/swr-services/category/types";
import { useGetCountries } from "@/lib/swr-services/country";
import {
  MainCategoryProps,
  mainCategorySchema,
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
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Status } from "@prisma/client";

const CategoryTable: React.FC = () => {
  const [checked, setChecked] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>();
  const [getCountryId, setGetCountryId] = useState<string>();
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    countryId?: string;
  } | null>();
  const [responseErrorMsg, setResponseErrorMsg] = useState<string>();
  const [imgUrl, setImgUrl] = useState<string>("");

  const { openSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const theme = useTheme();

  // api
  const {
    data: countries = [],
    error: countryError,
    isLoading: countriesLoading,
    isValidating: countriesValidation,
  } = useGetCountries();

  const {
    data: categories = [],
    error: categoryError,
    isLoading: categoriesLoading,
    isValidating: categoriesValidation,
    mutate: categoryMutate,
  } = useGetCategories();

  const { data: binCountries = [], mutate: binMutate } = useGetBinCategory({
    revalidateOnFocus: true,
  });

  const {
    trigger: createCategory,
    error: createError,
    isMutating: categoryMutating,
  } = useCategoryMutation();

  const {
    trigger: updateTrigger,
    isMutating: updateMutating,
    error: updateError,
  } = useUpdateCategory();

  const {
    trigger: deleteTrigger,
    isMutating: deleteMutating,
    error: deleteError,
  } = useDeleteCategory();

  const {
    trigger: swapTrigger,
    isMutating: swapMutating,
    error: swapError,
  } = useUpdateMainCategorySortNumber();

  const handleStatusChange = (value: boolean) => {
    setChecked(value);
  };

  // create action
  const handleCreate: MRT_TableOptions<CategoryData>["onCreatingRowSave"] =
    async ({ values, table }) => {
      const newData: MainCategoryProps = {
        ...values,
        categoryImage: imgUrl,
        status: checked ? Status.ACTIVE : Status.INACTIVE,
        countryId: selected as string,
      };

      const errors = await validateData(mainCategorySchema, newData);
      if (errors) {
        setValidationErrors(errors);
        return;
      }
      await createCategory(newData, {
        onSuccess: (res) => {
          openSnackbar(res?.data?.message, "success");
          table.setCreatingRow(null);
        },
        onError: (err) => {
          const { message } = err?.response?.data;
          setResponseErrorMsg(message);
          table.setEditingRow(null);
        },
      });
    };

  // update action
  const handleUpdate: MRT_TableOptions<CategoryData>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const newData: MainCategoryProps = {
        ...values,
        categoryImage: imgUrl,
        status: checked ? Status.ACTIVE : Status.INACTIVE,
        countryId: (selected || getCountryId) as string,
      };

      const errors = await validateData(mainCategorySchema, newData);

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

  const columns = useMemo<MRT_ColumnDef<CategoryData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Category Name",
        enableSorting: false,
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          variant: "outlined",
          label: null,
          placeholder: "Category Name",
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
              {row?.original?.categoryImage ? (
                <Box
                  width={40}
                  height={40}
                  sx={{ overflow: "hidden", borderRadius: theme.spacing(2) }}
                >
                  <Image
                    width={40}
                    height={40}
                    src={row?.original?.categoryImage}
                    alt="categoryImage"
                  />
                </Box>
              ) : (
                <Image
                  src="/uploads/images/default/main-category.svg"
                  alt="main-category"
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
        accessorKey: "country",
        header: "Country",
        enableSorting: false,
        enableColumnFilter: false,
        editVariant: "text",
        enableEditing: false,
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
                sx={{
                  width: "100%",
                }}
                defaultValue={row?.original?.countryId}
                onChange={(e) => setSelected(e?.target?.value as string)}
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
                      handleStatusChange(event.target.checked);
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
    [checked, validationErrors, countries],
  );

  const table = useMaterialReactTable({
    columns,
    data: categories,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    rowNumberDisplayMode: "original",

    positionCreatingRow: "top",
    positionActionsColumn: "last",
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
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

    muiTopToolbarProps: {
      className: "table-top-toolbar-wrap",
    },
    muiToolbarAlertBannerProps:
      countryError || categoryError || createError || updateError
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
          // data?.splice(
          //   (hoveredRow as MRT_Row<any>).index,
          //   0,
          //   data?.splice(draggingRow.index, 1)[0]
          // );
          // setData([...data])
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
              setGetCountryId(row.original.countryId);
              setChecked(row?.original?.status === Status.ACTIVE);
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
          Create New Category
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
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          variant="caption"
          sx={{
            fontSize: fontSize.md,
          }}
          align="center"
        >
          Edit Category
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
          <FileUpload
            imgUrl={imgUrl}
            initialUrl={row?.original?.categoryImage}
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
    ),

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
          <IconButton onClick={() => categoryMutate()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {binCountries?.length > 0 && (
          <Link href="/admin/category/bin">
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
          Create New Category
        </Button>
      </Box>
    ),

    state: {
      isLoading: countriesLoading || categoriesLoading,
      isSaving:
        categoryMutating || updateMutating || deleteMutating || swapMutating,
      showAlertBanner:
        countryError ||
        categoryError ||
        createError ||
        updateError ||
        deleteError ||
        swapError,
      showProgressBars: countriesLoading || categoriesLoading,
      showSkeletons: countriesValidation || categoriesValidation,
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

export default CategoryTable;
