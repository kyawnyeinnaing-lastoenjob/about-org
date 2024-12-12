import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Image from "next/image";

import {
  LoadingButtonStyled,
  TableWrapStyled,
} from "@/components/shared/themes/ui/styles";
import { useDialog } from "@/hooks/useDialog";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useDeleteCountry,
  useGetBinCountries,
  useRestoreCountry,
  useUpdateMultipleCountries,
} from "@/lib/swr-services/country";
import { Country } from "@/lib/swr-services/country/types";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PublicIcon from "@mui/icons-material/Public";
import RestoreIcon from "@mui/icons-material/Restore";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Stack, Tooltip } from "@mui/material";
import { Status } from "@prisma/client";

const BinTable = () => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const { openSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();

  // api
  const {
    data: binCountries = [],
    mutate,
    isLoading,
    isValidating,
  } = useGetBinCountries();
  const { trigger: bulkUpdateTrigger, isMutating: bulkRestoreMutating } =
    useUpdateMultipleCountries();
  const { trigger: restoreTrigger, isMutating: restoreMutating } =
    useRestoreCountry();
  const { trigger: deleteTrigger, isMutating: deleteMutating } =
    useDeleteCountry();

  const columns = useMemo<MRT_ColumnDef<Country>[]>(
    () => [
      {
        accessorKey: "flag",
        header: "Flag",
        Cell: ({ row }) => {
          return (
            <>
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
            </>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Country Name",
      },
      {
        accessorKey: "countryCode",
        header: "Country Code",
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => {
          return row?.original?.status === Status.ACTIVE ? (
            <Chip variant="filled" label="Active" color="success" />
          ) : (
            <Chip variant="filled" label="InActive" color="error" />
          );
        },
      },
    ],
    [],
  );

  const handleBulkRestore = async () => {
    const selectedData = binCountries
      .filter((row) => rowSelection[row.id])
      .map((d) => ({
        id: d.id,
        name: d.name,
        countryCode: d.countryCode,
        status: d.status,
        isDeleted: false,
      }));
    await bulkUpdateTrigger(
      {
        data: selectedData,
      },
      {
        onSuccess: (res) => {
          mutate();
          openSnackbar(res?.data?.message, "success");
        },
      },
    );
  };

  const handleRestore = async (id: string) => {
    const selectedData = binCountries.find((row) => row.id === id);
    if (selectedData) {
      const data = {
        name: selectedData?.name,
        countryCode: selectedData?.countryCode,
        status: selectedData?.status,
        isDeleted: false,
      };
      await restoreTrigger(
        {
          id: selectedData?.id as string,
          data,
        },
        {
          onSuccess: (res) => {
            mutate();
            openSnackbar(res?.data?.message, "success");
          },
        },
      );
    }
  };

  // hard delete action
  const handleHardDelete = (id: string) => {
    deleteTrigger(
      { id, hardDelete: true },
      {
        onSuccess: (res) => {
          closeDialog();
          mutate();
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
              onClick={() => handleHardDelete(id)}
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

  const table = useMaterialReactTable({
    columns,
    data: binCountries,
    enableRowSelection: true,
    enableEditing: true,
    positionActionsColumn: "last",
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "6px" }}>
        <Tooltip title="Restore">
          <LoadingButtonStyled
            onClick={() => handleRestore(row?.original?.id)}
            loading={restoreMutating}
          >
            <RestoreIcon />
          </LoadingButtonStyled>
        </Tooltip>
        <Tooltip title="Delete Forever">
          <LoadingButtonStyled
            onClick={() => handleOpenDialog(row?.original?.id)}
            loading={deleteMutating}
          >
            <DeleteForeverIcon />
          </LoadingButtonStyled>
        </Tooltip>
      </Box>
    ),
    // muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
    //   onClick: (event) =>
    //     getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event),
    //   sx: { cursor: "pointer" }
    // }),
    renderTopToolbarCustomActions: ({ table }) => (
      <Stack direction="row" justifyContent="flex-start" spacing={1}>
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <Tooltip title="Restore All" onClick={handleBulkRestore}>
          <LoadingButtonStyled loading={bulkRestoreMutating}>
            <RestoreIcon />
          </LoadingButtonStyled>
        </Tooltip>
        <MRT_ToggleGlobalFilterButton table={table} />
      </Stack>
    ),
    renderToolbarInternalActions: () => <div />,
    state: {
      rowSelection,
      isLoading,
      showProgressBars: isLoading,
      showSkeletons: isValidating,
      isSaving: true,
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

export default BinTable;
