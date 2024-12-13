"use client";
import React, { useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { countrySlugAtom } from "@/components/layout/user/atoms";
import { fontSize } from "@/components/shared/themes/fontStyles";
import { CategoryByCountry } from "@/lib/swr-services/country/types";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Chip, List, Stack, styled, useTheme } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import { checkCountryChangeAtom } from "../atoms";

const SubListItemButton = styled(ListItemButton)(({ theme }) => ({
  ["&:hover"]: {
    "& .arrow-icon": {
      display: "block",
      transition: "display .3s ease",
    },
  },
  ["&.Mui-selected"]: {
    // border: '1px solid',
    // borderColor: theme.palette.colors.blue[900],
    backgroundColor: theme.palette.colors.orange[50],
    color: theme.palette.colors.orange[900],
    ["& .MuiListItemText-secondary"]: {
      color: theme.palette.colors.orange[900],
    },
    ["& .MuiChip-filled"]: {
      backgroundColor: theme.palette.colors.orange[900],
    },
    "& .arrow-icon": {
      display: "block",
      transition: "display .3s ease",
    },
  },
}));

interface ListItemProps {
  category: CategoryByCountry;
  open: boolean;
  onClick: (slug: string) => void;
}

const MainCategoryListItem: React.FC<ListItemProps> = ({ category }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [countrySlug] = useAtom(countrySlugAtom);
  const [, setCheckCountryChange] = useAtom(checkCountryChangeAtom);
  const params = useParams();
  const theme = useTheme();
  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.colors.white,
        borderRadius: theme.spacing(2),
        ...(open && { mb: 2 }),
      })}
    >
      <ListItemButton
        className="item-btn"
        onClick={handleClick}
        selected={open}
      >
        <Image
          width={32}
          height={32}
          src={
            category?.categoryImage ||
            (open
              ? "/uploads/images/default/active-main-category.svg"
              : "/uploads/images/default/main-category.svg")
          }
          alt="icon"
          style={{ marginRight: "8px", borderRadius: theme.spacing(1) }}
        />
        <ListItemText
          primary={category?.name}
          primaryTypographyProps={{
            style: {
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitLineClamp: 2,
            },
          }}
          sx={{
            "& span": { fontWeight: open ? 700 : 400, fontSize: fontSize.sm },
          }}
        />
        {open ? (
          <Image
            width={15}
            height={15}
            src="/uploads/icons/caret-open.svg"
            alt="icon"
          />
        ) : (
          <Image
            width={15}
            height={15}
            src="/uploads/icons/caret.svg"
            alt="icon"
          />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ rowGap: 1, px: "4px" }}>
          {category?.SubCategory?.filter(
            (each) => each?._count?.Listing > 0,
          )?.map((each, index) => (
            <Link
              href={`/${countrySlug}/ads/list/${category.slug}/${each.slug}`}
              key={index}
              onClick={() => {
                setActive(true);
                setCheckCountryChange(false);
              }}
            >
              <SubListItemButton
                className="sub-item-btn"
                sx={{ pl: 2 }}
                selected={params?.subCategorySlug === each?.slug}
              >
                <PlayArrowRoundedIcon
                  className="arrow-icon"
                  sx={(theme) => ({
                    display: "none",
                    color: theme.palette.colors.orange[900],
                    mr: 1,
                  })}
                />
                <Image
                  width={32}
                  height={32}
                  src={
                    each?.subCategoryImage ||
                    (active
                      ? "/uploads/images/default/active-sub-category.svg"
                      : "/uploads/images/default/sub-category.svg")
                  }
                  alt="icon"
                  style={{
                    marginRight: "8px",
                    borderRadius: theme.spacing(1),
                  }}
                />

                <ListItemText
                  secondaryTypographyProps={{
                    style: {
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      WebkitLineClamp: 2,
                      fontSize: fontSize.sm,
                    },
                  }}
                  secondary={each?.name}
                />
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    position: "relative",
                  }}
                >
                  <Chip
                    label={each?._count?.Listing ?? 0}
                    variant="filled"
                    sx={(theme) => ({
                      bgcolor: theme.palette.colors.orange[900],
                    })}
                  />
                  {/* <ChevronRightIcon
                    sx={(theme) => ({ color: theme.palette.grey[600], ml: 1 })}
                  /> */}
                </Stack>
              </SubListItemButton>
            </Link>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default MainCategoryListItem;
