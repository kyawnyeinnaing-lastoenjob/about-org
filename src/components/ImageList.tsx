"use client";
import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";

import { ListData } from "@/lib/swr-services/listing/types";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, Card, CardContent, Stack, styled } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import MImageList from "@mui/material/ImageList";

import { countrySlugAtom } from "./layout/user/atoms";
import {
  CardContentDesc,
  CardContentTitle,
} from "./shared/themes/ui/styles/Typography";

interface ImageListProps {
  list: ListData[];
}

const StyledImage = styled(Box)(({ theme }) => ({
  // height: '165px',
  ["& img"]: {
    borderRadius: theme.spacing(2),
    width: "86px",
    height: "86px",
  },
}));

const ImageList: React.FC<ImageListProps> = ({ list }) => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const getCols = () => {
    if (isDesktop) return 2;
    return 1;
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
            <Card sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", cursor: "pointer" }}>
                <StyledImage>
                  <Image
                    src={
                      item?.detailImage || "/uploads/images/default/list.svg"
                    }
                    alt="card img"
                    width={133}
                    height={133}
                    style={{ aspectRatio: 1 / 1 }}
                  />
                </StyledImage>

                <CardContent sx={{ pl: 3 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack>
                      <CardContentTitle variant="h4">
                        {item.title}
                      </CardContentTitle>
                      <CardContentDesc variant="body2">
                        {item.shortDescription}
                      </CardContentDesc>
                    </Stack>
                    <Box>
                      <ChevronRightRoundedIcon />
                    </Box>
                  </Stack>
                </CardContent>
              </Box>
            </Card>
          </Link>
        ))}
      </MImageList>
    </Box>
  );
};

export default ImageList;
