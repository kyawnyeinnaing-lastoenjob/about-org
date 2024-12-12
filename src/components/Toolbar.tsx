import React from "react";

import { Sorting } from "@/lib/enum";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";

interface ToolbarProps {
  listLength: number;
  itemCount: number;
  sorting: Sorting | undefined;
  setSorting: (arg: Sorting) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  listLength,
  itemCount = 5,
  sorting,
  setSorting,
}) => {
  // const [sorting, setSorting] = useState<Sorting>(Sorting.ASC);
  const theme = useTheme();
  const toggleSorting = () => {
    setSorting(sorting === Sorting.ASC ? Sorting.DESC : Sorting.ASC);
  };
  console.log("==========", listLength);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={(theme) => ({ color: theme.palette.colors.gray[600] })}>
        Total of <span>{itemCount}</span>
        {/* {listLength}/{itemCount} */}
      </Typography>
      <Typography
        onClick={toggleSorting}
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          "& span": {
            color: theme.palette.colors.gray[900],
          },
        })}
      >
        <span>{sorting === Sorting.ASC ? "Oldest" : "Latest"}</span>
        <IconButton size="small">
          <ArrowDropDownIcon
            sx={{
              color: theme.palette.colors.gray[600],
              transform: sorting === Sorting.DESC ? "scaleX(-1)" : "scaleX(1)",
            }}
          />
        </IconButton>
      </Typography>
    </Stack>
  );
};

export default Toolbar;
