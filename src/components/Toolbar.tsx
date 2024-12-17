import React from "react";

import { Sorting } from "@/lib/enum";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

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
  setSorting
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
            color: theme.palette.colors.gray[900]
          }
        })}
      >
        <span>{sorting === Sorting.ASC ? "Oldest" : "Latest"}</span>
        <IconButton size="small" sx={{ p: 0 }}>
          <ArrowDropDownRoundedIcon
            sx={{
              color: theme.palette.colors.gray[600],
              transform: sorting === Sorting.DESC ? "scale(-1)" : "scale(1)",
              fontSize: theme.spacing(3),
              width: theme.spacing(3),
              height: theme.spacing(3)
            }}
          />
        </IconButton>
      </Typography>
    </Stack>
  );
};

export default Toolbar;
