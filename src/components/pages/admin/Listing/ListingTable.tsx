"use client";
import { useMemo, useTransition } from "react";
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  // MRT_EditActionButtons,
  MRT_ShowHideColumnsButton,
  // MRT_TableOptions,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  // type MRT_Row,
  // type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
// import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import { TableWrapStyled } from "@/components/shared/themes/ui/styles";
import { useDialog } from "@/hooks/useDialog";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useDeleteList,
  useGetAllListings,
  useGetBinListing,
  useUpdateListingSortNumber,
} from "@/lib/swr-services/listing";
import { ListData } from "@/lib/swr-services/listing/types";
// import { SwapSortNumberProps, swapSortNumberSchema } from '@/lib/zod';
// import { validateData } from '@/utils/validations';
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { LoadingButton } from "@mui/lab";
import {
  // Alert,
  Box,
  Button,
  Chip,
  // DialogActions,
  // DialogContent,
  // DialogTitle,
  // FormControlLabel,
  IconButton,
  // MenuItem,
  // Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Status } from "@prisma/client";

const ListingTable: React.FC = () => {
  const router = useRouter();

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { openSnackbar } = useSnackbar();
  const { openDialog, closeDialog } = useDialog();
  const [, startTransition] = useTransition();

  const { isMutating: swapMutating, error: swapError } =
    useUpdateListingSortNumber();

  const {
    data: infos = [],
    error: infoError,
    isLoading: infoLoading,
    isValidating: infoValidating,
    mutate: infoMutate,
  } = useGetAllListings({
    pageIndex: 1,
    pageSize: 1000,
  });

  const { data: binListings = [], mutate: binMutate } = useGetBinListing({
    revalidateOnFocus: true,
  });

  const {
    trigger: deleteTrigger,
    isMutating: deleteMutating,
    error: deleteError,
  } = useDeleteList();

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

  const columns = useMemo<MRT_ColumnDef<ListData>[]>(
    () => [
      // {
      //   accessorKey: "detailImage",
      //   enableSorting: false,
      //   enableColumnFilter: false,
      //   header: "Detail Image",
      //   Cell: ({ row }) => {
      //     return (
      //       <Box
      //         width={40}
      //         height={40}
      //         sx={{ overflow: "hidden", borderRadius: "50%" }}
      //       >
      //         <Image
      //           width={40}
      //           height={40}
      //           alt=""
      //           src={
      //             row?.original?.detailImage ??
      //             "/uploads/images/default/detail.svg"
      //           }
      //         />
      //       </Box>
      //     );
      //   },
      // },
      {
        accessorKey: "title",
        enableSorting: false,
        header: "Title",
      },
      {
        accessorKey: "shortDescription",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Short Description",
        Cell: ({ row }) => {
          return (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 4,
                maxWidth: "250px",
              }}
            >
              {row?.original?.shortDescription}
            </Typography>
          );
        },
      },
      {
        accessorKey: "description",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Description",
        Cell: ({ row }) => {
          return (
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                WebkitLineClamp: 4,
                maxWidth: "250px",
              }}
            >
              {row?.original?.description}
            </Typography>
          );
        },
      },
      {
        accessorKey: "country",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Country",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.country?.name}</Typography>;
        },
      },
      {
        accessorKey: "mainCategory",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Category",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.mainCategory?.name}</Typography>;
        },
      },
      {
        accessorKey: "subCategory",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Sub Category",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.subCategory?.name}</Typography>;
        },
      },
      {
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: false,
        header: "Status",
        Cell: ({ row }) => {
          return row?.original?.status === Status.ACTIVE ? (
            <Chip variant="filled" label="Active" color="success" />
          ) : (
            <Chip variant="filled" label="InActive" color="error" />
          );
        },
      },
      {
        accessorKey: "shareToFacebook",
        enableColumnFilter: false,
        enableSorting: false,
        header: "Share To Facebook",
        Cell: ({ row }) => {
          return row?.original?.shareToFacebook === Status.ACTIVE ? (
            <Chip variant="filled" label="Active" color="success" />
          ) : (
            <Chip variant="filled" label="InActive" color="error" />
          );
        },
      },
      {
        accessorKey: "shareToViber",
        enableColumnFilter: false,
        enableSorting: false,
        header: "Share To Viber",
        Cell: ({ row }) => {
          return row?.original?.shareToViber === Status.ACTIVE ? (
            <Chip variant="filled" label="Active" color="success" />
          ) : (
            <Chip variant="filled" label="InActive" color="error" />
          );
        },
      },
      {
        accessorKey: "shareToTelegram",
        enableColumnFilter: false,
        enableSorting: false,
        header: "Share To Telegram",
        Cell: ({ row }) => {
          return row?.original?.shareToTelegram === Status.ACTIVE ? (
            <Chip variant="filled" label="Active" color="success" />
          ) : (
            <Chip variant="filled" label="InActive" color="error" />
          );
        },
      },
      {
        accessorKey: "shareHashTag",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Share HashTag",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.shareHashTag}</Typography>;
        },
      },
      {
        accessorKey: "shareTitle",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Share Title",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.shareTitle}</Typography>;
        },
      },
      {
        accessorKey: "shareDescription",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Share Description",
        Cell: ({ row }) => {
          return <Typography>{row?.original?.shareDescription}</Typography>;
        },
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: infos,
    createDisplayMode: "modal",
    editDisplayMode: isMobile ? "modal" : "row",
    rowNumberDisplayMode: "original",

    positionCreatingRow: "top",
    positionActionsColumn: "last",

    enableEditing: true,
    enableRowNumbers: true,
    enableTopToolbar: true,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enableRowOrdering: false,
    enableColumnPinning: true,

    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
        overflowX: "scroll",
      },
    },

    muiTopToolbarProps: {
      className: "table-top-toolbar-wrap",
    },
    // muiRowDragHandleProps: ({}) => ({
    //   onDragEnd: () => {
    //     const { draggingRow, hoveredRow } = table.getState();
    //     if (draggingRow && hoveredRow && draggingRow.original && hoveredRow.original) {
    //       handleSwapSortNumber(draggingRow.original.id, hoveredRow.original.id);

    //       // data?.splice(
    //       //   (hoveredRow as MRT_Row<any>).index,
    //       //   0,
    //       //   data?.splice(draggingRow.index, 1)[0]
    //       // );
    //       // setData([...data])
    //     }
    //   },
    // }),

    renderRowActions: ({ row }) => {
      return (
        <Box sx={{ display: "flex", gap: "6px" }}>
          <Tooltip title="Edit">
            <IconButton
              color="error"
              onClick={() => handleEditClick(row.original)}
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
          <IconButton onClick={() => infoMutate()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {binListings?.length > 0 && (
          <Link href="/admin/listing/bin">
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
    renderToolbarInternalActions: () => (
      <Box>
        <Link href="/admin/listing/create">
          <Button variant="contained">Create New</Button>
        </Link>
      </Box>
    ),

    state: {
      isLoading: infoLoading,
      isSaving: deleteMutating || swapMutating,
      showAlertBanner: infoError || deleteError || swapError,
      showSkeletons: infoValidating,
    },
    initialState: {
      columnPinning: { right: isMobile ? undefined : ["mrt-row-actions"] },
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
  });

  const handleEditClick = (row: ListData) => {
    startTransition(() => {
      router.push(`/admin/listing/edit/${row?.id}/${row?.country?.slug}`);
    });
  };

  // swap action
  // const handleSwapSortNumber = async (id1: string, id2: string) => {
  //   const newData: SwapSortNumberProps = { id1, id2 };

  //   const errors = await validateData(swapSortNumberSchema, newData);

  //   if (errors) {
  //     // setValidationErrors(errors);
  //     return;
  //   }
  //   await swapTrigger(
  //     { data: newData },
  //     {
  //       onSuccess: (res) => {
  //         infoMutate();
  //         // openSnackbar(res?.data?.message, 'success');
  //         // table.setEditingRow(null);

  //         closeDialog();
  //         openSnackbar(res?.data?.message, 'success');
  //       },
  //     }
  //   );
  // };

  return (
    <Stack spacing={2}>
      <TableWrapStyled>
        <MaterialReactTable table={table} />
      </TableWrapStyled>
    </Stack>
  );
};

export default ListingTable;
