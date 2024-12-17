"use client";
import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";

import {
  IOSSwitch,
  TableWrapStyled,
} from "@/components/shared/themes/ui/styles";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useGetSetting, useUpdateSetting } from "@/lib/swr-services/setting";
import { SettingData } from "@/lib/swr-services/setting/types";
import { SettingProps } from "@/lib/zod";
import { Alert, Chip, FormControlLabel, Stack } from "@mui/material";
import { Status } from "@prisma/client";

const SettingTable: React.FC = () => {
  const [checked, setChecked] = useState<boolean>();
  const [responseErrorMsg, setResponseErrorMsg] = useState<string>();

  const { openSnackbar } = useSnackbar();

  // api
  const {
    data: setting = [],
    error,
    isLoading,
    isValidating,
  } = useGetSetting();

  const {
    trigger: updateTrigger,
    isMutating: updateMutating,
    error: updateError,
  } = useUpdateSetting();

  // const handleStatusChange = (value: boolean) => {
  //   setChecked(value);
  // };

  // update action
  const handleUpdate: MRT_TableOptions<SettingData>["onEditingRowSave"] =
    async ({ table, row }) => {
      const newData: SettingProps = {
        name: row?.original?.name,
        status: checked ? Status.ACTIVE : Status.INACTIVE,
      };

      await updateTrigger(
        { data: newData, id: row?.original?.id },
        {
          onSuccess: (res) => {
            openSnackbar(res?.data?.message, "success");
            table.setEditingRow(null);
          },
          onError: (err) => {
            const { message } = err?.response.data.data;
            setResponseErrorMsg(message);
            table.setCreatingRow(null);
          },
        },
      );
    };

  const columns = useMemo<MRT_ColumnDef<SettingData>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        enableEditing: false,
        enableSorting: false,
        enableHiding: false,
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
          console.log("status from row => ", row?.original?.status);
          console.log(row?.original?.status === Status.ACTIVE);
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
    [checked],
  );

  const table = useMaterialReactTable({
    columns,
    data: setting,
    createDisplayMode: "modal",
    editDisplayMode: "row",
    rowNumberDisplayMode: "original",

    positionCreatingRow: "top",
    positionActionsColumn: "last",
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    enablePagination: false,
    enableEditing: true,
    enableRowNumbers: true,
    enableTopToolbar: true,
    enableColumnOrdering: false,
    enableColumnActions: false,
    enableRowOrdering: false,

    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },

    muiTopToolbarProps: {
      className: "table-top-toolbar-wrap",
    },
    muiToolbarAlertBannerProps:
      error || updateError
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
    // onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdate,

    state: {
      isLoading,
      isSaving: updateMutating,
      showAlertBanner: error,
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

export default SettingTable;
