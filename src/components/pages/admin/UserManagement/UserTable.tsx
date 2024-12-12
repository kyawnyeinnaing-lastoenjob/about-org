"use client";
import React, { useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import { TableWrapStyled } from "@/components/shared/themes/ui/styles";
import { useGetUserList } from "@/lib/swr-services/user-management";
import { User } from "@/lib/swr-services/user-management/type";
import EditIcon from "@mui/icons-material/Edit";
import Face6Icon from "@mui/icons-material/Face6";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Alert,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { Status } from "@prisma/client";

const UserTable = () => {
  const router = useRouter();

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const {
    data: users = [],
    isLoading,
    isValidating,
    mutate,
    error,
  } = useGetUserList();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "image",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Image",
        Cell: ({ row }) => {
          return (
            <>
              {row?.original?.image ? (
                <Box
                  width={40}
                  height={40}
                  sx={{ overflow: "hidden", borderRadius: "50%" }}
                >
                  <Image
                    width={40}
                    height={40}
                    alt=""
                    src={row?.original?.image}
                  />
                </Box>
              ) : (
                <Face6Icon sx={{ width: 50, height: 50 }} />
              )}
            </>
          );
        },
      },
      {
        accessorKey: "name",
        header: "User Name",
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "email",
        enableSorting: false,
        header: "Email",
      },
      {
        accessorKey: "phone",
        enableSorting: false,
        header: "Phone Number",
      },
      {
        accessorKey: "userId",
        enableSorting: false,
        header: "User ID",
      },
      {
        accessorKey: "status",
        enableSorting: false,
        header: "Status",
        enableColumnFilter: false,
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

  const table = useMaterialReactTable({
    columns,
    data: users,
    createDisplayMode: isMobile ? "modal" : "row",
    editDisplayMode: isMobile ? "modal" : "row",
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
    // enableRowOrdering: true,
    renderRowActions: ({ row }) => (
      <Stack direction="row" spacing={1}>
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => handleEditClick(row.original)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        {/* Add more action buttons here if needed */}
      </Stack>
    ),

    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },

    muiTopToolbarProps: {
      className: "table-top-toolbar-wrap",
    },
    // muiRowDragHandleProps: ({}) => ({
    //   onDragEnd: () => {
    //     const { draggingRow, hoveredRow } = table.getState();
    //     console.log('dragging row => ', draggingRow?.index, draggingRow?.original?.name);
    //     console.log('hover row => ', hoveredRow?.index, hoveredRow?.original?.name);
    //     if (draggingRow && hoveredRow && draggingRow.original && hoveredRow.original) {
    //       handleSwapSortNumber(draggingRow.original.id, hoveredRow.original.id);
    //     }
    //   },
    // }),

    renderTopToolbarCustomActions: ({ table }) => (
      <Stack direction="row" justifyContent="flex-start" spacing={1}>
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <Tooltip title="Refetch">
          <IconButton onClick={() => mutate()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <MRT_ToggleGlobalFilterButton table={table} />
      </Stack>
    ),
    renderToolbarInternalActions: () => (
      <Box>
        <Button
          variant="contained"
          onClick={() => {
            router.push(`/admin/user-management/create`);
          }}
        >
          Create New User
        </Button>
      </Box>
    ),
    muiToolbarAlertBannerProps: error
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
                {String(error)}
              </Alert>
            </>
          ),
          variant: "filled",
        }
      : undefined,

    state: {
      isLoading,
      // isSaving: swapMutating,
      showAlertBanner: error,
      showProgressBars: isLoading,
      showSkeletons: isValidating,
    },
  });

  const handleEditClick = (row: User) => {
    router.push(`/admin/user-management/edit/${row?.id}`);
  };

  // swap action
  // const handleSwapSortNumber = async (id1: string, id2: string) => {
  // const newData: SwapSortNumberProps = { id1, id2 };

  // const errors = await validateData(swapSortNumberSchema, newData);

  // if (errors) {
  //   setValidationErrors(errors);
  //   return;
  // }
  // await swapTrigger(
  //   { data: newData },
  //   {
  //     onSuccess: (res) => {
  //       // openSnackbar(res?.data?.message, 'success');
  //       // table.setEditingRow(null);

  //       // closeDialog();
  //       openSnackbar(res?.data?.message, 'info');
  //     },
  //   }
  // );
  // };

  return (
    <Stack spacing={2}>
      <TableWrapStyled>
        <MaterialReactTable table={table} />
      </TableWrapStyled>
    </Stack>
  );
};

export default UserTable;
