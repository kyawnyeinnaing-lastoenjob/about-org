"use client";
import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { ListData } from "@/lib/swr-services/listing/types";
import { Box, ImageListItem, ImageListItemBar, styled } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import MImageList from "@mui/material/ImageList";

import { countrySlugAtom } from "./layout/user/atoms";

interface ImageListProps {
  list: ListData[];
}

const BoxStyled = styled(Box)(({ theme }) => ({
  width: "100%",
  aspectRatio: "1 / 1.3",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.spacing(2),
  cursor: "pointer",
  ["& img"]: {
    transition: "transform 0.3s ease",
  },
  ["&:hover"]: {
    img: {
      transform: "scale(1.1)",
    },
  },
  ["& .backdrop"]: {
    background:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 90%, rgba(0,0,0,0.7) 95%, rgba(0, 0, 0, 0.8) 100%)",
    height: "100%",
  },
}));

const ImageList: React.FC<ImageListProps> = ({ list }) => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("xl"));
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "xl"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const getCols = () => {
    if (isDesktop) return 5;
    if (isLaptop) return 3;
    if (isTablet) return 3;
    return 2; // Default for mobile
  };

  return (
    <Box width="100%">
      <MImageList
        cols={getCols()}
        sx={(theme) => ({
          gap: {
            xs: `${theme.spacing(1)} !important`,
            lg: `${theme.spacing(2)} !important`,
          },
          px: 1,
        })}
      >
        {list.map((item, index) => (
          <Link
            key={index}
            href={`/${countrySlug}/detail/${item?.mainCategory?.slug}/${item?.subCategory?.slug}/${item?.id}`}
          >
            <ImageListItem key={index} sx={{ position: "relative" }}>
              <BoxStyled>
                <Image
                  src={item?.detailImage || "/uploads/images/default/list.svg"}
                  alt={item?.title}
                  loading="lazy"
                  sizes="100%"
                  width={400}
                  height={452}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                  component="div"
                  className="backdrop"
                />
              </BoxStyled>
              <ImageListItemBar title={item.title} />
            </ImageListItem>
          </Link>
        ))}
      </MImageList>
    </Box>
  );
};

export default ImageList;
