import React from "react";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { styled, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MSelect, { SelectChangeEvent } from "@mui/material/Select";

interface Options {
  value: string;
  label: string | number | React.ReactNode | React.ReactElement;
}

interface SelectProps {
  selected: string;
  onChange: (e: SelectChangeEvent<string>, child: React.ReactNode) => void;
  options: Options[];
  title?: string;
}

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  padding: "12px 16px",
  backgroundColor: theme.palette.colors.white,
  borderRadius: 0,
  ["&:hover, &.MuiButtonBase-root.Mui-selected"]: {
    backgroundColor: theme.palette.colors.orange[150],
    outline: "none",
    ["& p"]: { color: `${theme.palette.colors.orange[900]} !important` }
  }
}));

const CustomExpandMoreIcon = styled(ArrowDropDownRoundedIcon)(({ theme }) => ({
  fill: theme.breakpoints.up("lg")
    ? theme.palette.colors.gray[600]
    : theme.palette.colors.gray[600],
  fontSize: theme.spacing(3)
}));

const Select: React.FC<SelectProps> = ({
  selected,
  onChange,
  options,
  title
}) => {
  return (
    <MSelect
      value={selected}
      onChange={onChange}
      IconComponent={CustomExpandMoreIcon}
      renderValue={(selected) => {
        const selectedItem = options.find((item) => item.value === selected);
        return selectedItem
          ? React.cloneElement(
              selectedItem.label as React.ReactElement<{
                hideTypo?: boolean;
                children: React.ReactNode;
              }>,
              {
                hideTypo: true
              }
            )
          : "";
      }}
      sx={(theme) => ({
        borderRadius: theme.spacing(1),
        height: 40,
        backgroundColor: theme.palette.colors.white,
        boxShadow: "none",
        border: `1px solid ${theme.palette.colors.orange[900]} !important`,
        ["& p"]: { color: theme.palette.colors.gray[900] }
      })}
      MenuProps={{
        anchorOrigin: { vertical: "bottom", horizontal: "center" },
        PaperProps: { sx: (theme) => ({ borderRadius: theme.spacing(2) }) },
        MenuListProps: {
          sx: () => ({
            minWidth: { xs: "178px", lg: "178px" },
            padding: "4px",
            p: 0
          })
        }
      }}
    >
      {title && (
        <Typography color="#0E101B" fontWeight={"bold"}>
          {title}
        </Typography>
      )}
      {options.map((item, index) => (
        <MenuItemStyled key={index} value={item.value}>
          {item.label}
        </MenuItemStyled>
      ))}
    </MSelect>
  );
};

export default Select;
