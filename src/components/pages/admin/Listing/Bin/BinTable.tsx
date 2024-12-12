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
  useDeleteList,
  useGetBinListing,
  useRestoreListing,
  useUpdateMultipleListings,
} from "@/lib/swr-services/listing";
import { ListData } from "@/lib/swr-services/listing/types";
import { ListingProps } from "@/lib/zod";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestoreIcon from "@mui/icons-material/Restore";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { Status } from "@prisma/client";

const BinTable: React.FC = () => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const { openSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();

  // api
  const {
    data: binListings = [],
    mutate,
    isLoading,
    isValidating,
  } = useGetBinListing();

  const { trigger: bulkUpdateTrigger, isMutating: bulkRestoreMutating } =
    useUpdateMultipleListings();

  const { trigger: restoreTrigger, isMutating: restoreMutating } =
    useRestoreListing();

  const { trigger: deleteTrigger, isMutating: deleteMutating } =
    useDeleteList();

  const columns = useMemo<MRT_ColumnDef<ListData>[]>(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        Cell: ({ row }) => {
          return (
            <Box
              width={40}
              height={40}
              sx={{ overflow: "hidden", borderRadius: "50%" }}
            >
              <Image
                width={40}
                height={40}
                alt=""
                src={
                  row?.original?.detailImage ??
                  "/uploads/images/default/list.svg"
                }
              />
            </Box>
          );
        },
      },
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "shortDescription",
        header: "Short Description",
      },
      {
        accessorKey: "description",
        header: "Description",
        Cell: ({ row }) => {
          return (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 4, // Number of lines to show
              }}
            >
              {row?.original?.description}
            </Typography>
          );
        },
      },
      {
        accessorKey: "country",
        header: "Country",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.country?.name}</Typography>;
        },
      },
      {
        accessorKey: "mainCategory",
        header: "Category",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.mainCategory?.name}</Typography>;
        },
      },
      {
        accessorKey: "subCategory",
        header: "Sub Category",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.subCategory?.name}</Typography>;
        },
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
    const data: ListingProps[] = binListings
      .filter((row) => rowSelection[row.id])
      .map((d) => ({
        id: d.id,
        title: d.title,
        shortDescription: d.shortDescription,
        description: d.description,
        countryId: d.countryId as string,
        mainCategoryId: d?.mainCategoryId as string,
        status: d.status as Status,
        isDeleted: false,

        shareToFacebook: d.shareToFacebook as Status,
        shareToViber: d.shareToViber as Status,
        shareToTelegram: d.shareToTelegram as Status,
      }));
    await bulkUpdateTrigger(
      {
        data,
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
    const selectedData = binListings.find((row) => row.id === id);
    if (selectedData) {
      const data = {
        id: selectedData?.id,
        title: selectedData?.title,
        shortDescription: selectedData?.shortDescription,
        description: selectedData?.description,
        countryId: selectedData?.countryId as string,
        mainCategoryId: selectedData?.mainCategoryId as string,
        subCategoryId: selectedData?.subCategoryId as string,
        status: selectedData?.status as Status,
        isDeleted: false,

        shareToFacebook: selectedData?.shareToFacebook as Status,
        shareToViber: selectedData?.shareToViber as Status,
        shareToTelegram: selectedData?.shareToTelegram as Status,
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
    data: binListings,
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
