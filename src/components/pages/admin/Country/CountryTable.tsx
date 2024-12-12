"use client";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  // MRT_GlobalFilterTextField,
  MRT_ShowHideColumnsButton,
  MRT_TableOptions,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Image from "next/image";
import Link from "next/link";

import FileUpload from "@/components/shared/FileUpload";
import { fontSize } from "@/components/shared/themes/fontStyles";
// import ImageUpload from '@/components/shared/themes/ui/ImageUpload';
import {
  IOSSwitch,
  TableWrapStyled,
} from "@/components/shared/themes/ui/styles";
import { useDialog } from "@/hooks/useDialog";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useCountryMutation,
  useDeleteCountry,
  useGetBinCountries,
  useGetCountries,
  useUpdateCountriesSortNumber,
  useUpdateCountry,
} from "@/lib/swr-services/country";
import { Country } from "@/lib/swr-services/country/types";
import {
  CountryProps,
  countrySchema,
  SwapSortNumberProps,
  swapSortNumberSchema,
} from "@/lib/zod";
import { validateData } from "@/utils/validations";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import PublicIcon from "@mui/icons-material/Public";
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
  FormControlLabel,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Status } from "@prisma/client";

const CountryTable: React.FC = () => {
  const [checked, setChecked] = useState<boolean>(true);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string[];
    countryCode?: string[];
  } | null>();
  const [responseErrorMsg, setResponseErrorMsg] = useState<string>();
  const [imgUrl, setImgUrl] = useState<string>("");

  const { openSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();

  // api
  const {
    data: countries = [],
    isLoading,
    isValidating,
    error,
    mutate,
  } = useGetCountries();

  const { data: binCountries = [], mutate: binMutate } = useGetBinCountries({
    revalidateOnFocus: true,
  });

  const {
    trigger: createTrigger,
    isMutating: createMutating,
    error: createError,
  } = useCountryMutation();

  const {
    trigger: updateTrigger,
    isMutating: updateMutating,
    error: updateError,
  } = useUpdateCountry();

  const {
    trigger: deleteTrigger,
    isMutating: deleteMutating,
    error: deleteError,
  } = useDeleteCountry();

  const {
    trigger: swapTrigger,
    isMutating: swapMutating,
    error: swapError,
  } = useUpdateCountriesSortNumber();

  const handleStatusChange = (value: boolean) => {
    setChecked(value);
    // if (countries[rowIndex]) {
    //   countries[rowIndex].status = value ? Status.ACTIVE : Status.INACTIVE; // Convert boolean to status string
    // } else {
    //   console.warn("Row index out of bounds");
    // }
  };

  // create action
  const handleCreate: MRT_TableOptions<Country>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const newData: CountryProps = {
      ...values,
      flag: imgUrl,
      status: checked ? Status.ACTIVE : Status.INACTIVE,
    };

    const errors = await validateData(countrySchema, newData);

    if (errors) {
      setValidationErrors(errors);
      return;
    }
    await createTrigger(newData, {
      onSuccess: (res) => {
        openSnackbar(res?.data?.message, "success");
        table.setCreatingRow(null);
      },
      onError: (err) => {
        const { message } = err?.response.data.data;
        setResponseErrorMsg(message);
        table.setCreatingRow(null);
      },
    });
  };

  // update action
  const handleUpdate: MRT_TableOptions<Country>["onEditingRowSave"] = async ({
    values,
    table,
    row,
  }) => {
    const newData: CountryProps = {
      ...values,
      flag: imgUrl,
      status: checked ? Status.ACTIVE : Status.INACTIVE,
    };

    const errors = await validateData(countrySchema, newData);

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
          // openSnackbar(res?.data?.message, 'success');
          // table.setEditingRow(null);

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
    // setOpenDialog(true);
    // setRowId(id);
  };

  console.log(validationErrors);

  const columns = useMemo<MRT_ColumnDef<Country>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Country Name",
        enableSorting: false,
        enableHiding: false,
        muiEditTextFieldProps: {
          required: true,
          variant: "outlined",
          label: null,
          placeholder: "Country Name",
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
              {row?.original?.flag ? (
                <Box
                  width={40}
                  height={40}
                  sx={{ overflow: "hidden", borderRadius: "50%" }}
                >
                  <Image
                    width={40}
                    height={40}
                    alt=""
                    src={row?.original?.flag}
                  />
                </Box>
              ) : (
                <PublicIcon sx={{ width: 50, height: 50 }} />
              )}
              <Typography align="left">{row?.original?.name}</Typography>
            </Stack>
          );
        },
      },
      {
        accessorKey: "countryCode",
        enableSorting: false,
        header: "Country Code",
        muiEditTextFieldProps: {
          required: true,
          variant: "outlined",
          label: null,
          placeholder: "Country Code",
          error: !!validationErrors?.countryCode,
          helperText: validationErrors?.countryCode,
          onFocus: () => {
            setValidationErrors((prev) => ({
              ...prev,
              countryCode: undefined,
            }));
          },
        },
      },
      {
        accessorKey: "mainCategory",
        header: "Category",
        enableSorting: false,
        enableColumnFilter: false,
        enableHiding: true,
        Cell: ({ row }) => {
          return (
            <Typography align="left">{row?.original?.categoryCount}</Typography>
          );
        },
        Edit: () => {
          return <></>;
        },
      },
      {
        accessorKey: "subCategory",
        header: "Sub Category",
        enableHiding: true,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => {
          return (
            <Typography align="left">
              {row?.original?.subCategoryCount}
            </Typography>
          );
        },
        Edit: () => {
          return <></>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: false,
        enableSorting: false,
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
                      handleStatusChange(event.target.checked);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checked, validationErrors, binCountries],
  );

  const table = useMaterialReactTable({
    columns,
    data: countries,
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

    muiTableContainerProps: { sx: { minHeight: "500px" } },

    muiTopToolbarProps: { className: "table-top-toolbar-wrap" },
    muiToolbarAlertBannerProps:
      error || createError || updateError || deleteError || swapError
        ? {
            color: "error",
            children: (
              <>
                <Alert
                  severity="error"
                  variant="filled"
                  sx={{
                    width: "100%",
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
              setImgUrl(row?.original?.flag);
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
          sx={{ fontSize: fontSize.md }}
          align="center"
        >
          Create New Country
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}

          <Box>
            <Typography
              fontStyle="italic"
              sx={(theme) => ({
                mb: 1,
                fontSize: fontSize.xs,
                color: theme.palette.colors.gray[400],
              })}
            >
              [Aspect Ration (1 : 1) recommended / Max - 2 MB]
            </Typography>
            {imgUrl ? (
              <Image src={imgUrl} width={40} height={40} alt="flag" />
            ) : (
              <FileUpload imgUrl={imgUrl} setImgUrl={setImgUrl} />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
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
          Edit Country
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
          <FileUpload
            imgUrl={imgUrl}
            initialUrl={row?.original?.flag}
            setImgUrl={setImgUrl}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
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
          <IconButton onClick={() => mutate()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {binCountries?.length > 0 && (
          <Link href="/admin/country/bin">
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
            setImgUrl("");
          }}
        >
          Create New Country
        </Button>
      </Box>
    ),

    state: {
      isLoading,
      isSaving:
        createMutating || updateMutating || deleteMutating || swapMutating,
      showAlertBanner: error || createError || updateError || deleteError,
      showProgressBars: isLoading,
      showSkeletons: isValidating,
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

export default CountryTable;
