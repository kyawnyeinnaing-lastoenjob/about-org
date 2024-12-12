"use client";
import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ErrorUI from "@/components/Error";
import { countrySlugAtom } from "@/components/layout/user/atoms";
import CachedIcon from "@mui/icons-material/Cached";
import { Box, Button } from "@mui/material";

const NoInternet = () => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const router = useRouter();
  return (
    <ErrorUI
      icon={
        <Box
          sx={{
            width: {
              xs: "120px",
              lg: "240px",
            },
            height: {
              xs: "80px",
              lg: "160px",
            },
          }}
        >
          <Image
            width={100}
            height={100}
            alt="404 icon"
            src={"/error/maintain.svg"}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      }
      title="No Internet Access!"
      desc="It seems you don’t have internet access at the moment."
      btn={
        <Button
          onClick={() => router.push(`/${countrySlug}/ads`)}
          sx={(theme) => ({
            background: theme.palette.colors.blue[950],
            width: {
              xs: "200px",
              lg: "200px",
            },
            height: "48px",
            borderRadius: theme.spacing(4),
            color: theme.palette.colors.white,
          })}
        >
          <CachedIcon
            sx={{
              marginRight: 2,
            }}
          />
          Refresh
        </Button>
      }
    />
  );
};

export default NoInternet;
