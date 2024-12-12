"use client";
import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ErrorUI from "@/components/Error";
import { countrySlugAtom } from "@/components/layout/user/atoms";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button } from "@mui/material";

const Page404 = () => {
  const [countrySlug] = useAtom(countrySlugAtom);
  const router = useRouter();
  return (
    <ErrorUI
      icon={
        <Box
          sx={{
            width: { xs: "120px", lg: "240px" },
            height: { xs: "80px", lg: "160px" },
          }}
        >
          <Image
            width={100}
            height={100}
            alt="404 icon"
            src={"/error/404.svg"}
            style={{ width: "100%", height: "100%" }}
          />
        </Box>
      }
      title="404; Page Not Found!"
      desc="We're sorry to say that the page you're looking for isn't available. It may have been moved or deleted."
      btn={
        <Button
          onClick={() => router.push(`/${countrySlug}/ads`)} //if need to redirect based on user or admin, need to check something like token
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
          <ArrowBackIcon sx={{ marginRight: 2 }} />
          Go Back
        </Button>
      }
    />
  );
};

export default Page404;
