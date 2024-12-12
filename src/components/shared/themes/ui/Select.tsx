import React from "react";

// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
  borderRadius: theme.spacing(2),
  padding: "12px 16px",
  backgroundColor: theme.palette.colors.gray[50],
  ["&.MuiButtonBase-root.Mui-selected"]: {
    border: `1px solid ${theme.palette.colors.blue[50]}`,
    backgroundColor: theme.palette.colors.blue[50],
    outline: "none",
    ["& p"]: {
      color: `${theme.palette.colors.blue[900]} !important`,
    },
  },
}));

const CustomExpandMoreIcon = styled(ArrowDropDownIcon)(({ theme }) => ({
  fill: theme.breakpoints.up("lg")
    ? theme.palette.colors.gray[600]
    : theme.palette.colors.gray[600],
}));

const Select: React.FC<SelectProps> = ({
  selected,
  onChange,
  options,
  title,
}) => {
  return (
    <MSelect
      value={selected}
      onChange={onChange}
      IconComponent={CustomExpandMoreIcon}
      renderValue={(selected) => {
        const selectedItem = options.find((item) => item.value === selected);
        return selectedItem
          ? React.cloneElement(selectedItem.label as React.ReactElement)
          : "";
      }}
      sx={(theme) => ({
        borderRadius: theme.spacing(1),
        height: 40,
        // backgroundImage: `linear-gradient(to right bottom, ${theme.palette.colors.blue[400]}, ${theme.palette.colors.blue[450]})`,
        backgroundColor: theme.palette.colors.white,
        boxShadow: "none",
        border: `1px solid ${theme.palette.colors.orange[900]}`,
        ["& p"]: {
          color: theme.palette.colors.blue[600],
        },
      })}
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        PaperProps: {
          sx: (theme) => ({
            borderRadius: theme.spacing(2),
          }),
        },
        MenuListProps: {
          sx: (theme) => ({
            minWidth: {
              xs: "178px",
              lg: "178px",
            },
            padding: "4px",
            gap: theme.spacing(1),
            borderRadius: "16px !important",
          }),
        },
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
