"use client";
import React, { useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

import { Box, CircularProgress, Stack, Typography } from "@mui/material";

const Splash: React.FC = () => {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const isResponsive = useMediaQuery({ maxWidth: 1023 });

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        if (isResponsive) {
          router.push("/myanmar/mobile");
        } else {
          router.push("/myanmar/ads");
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [router, isResponsive]);

  return (
    <Stack
      height="100vh"
      alignItems="center"
      sx={() => ({
        background: `linear-gradient(90deg, #14046A 0%, #170481 100%)`,
      })}
    >
      <Stack
        height="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        rowGap={2}
      >
        <Image src={"/uploads/logo.svg"} alt="logo" width={226} height={72} />
        <Typography color="#FFFFFF">လိုအပ်တိုင်းရှိမည် SHWE Charity</Typography>
        <Box sx={{ display: "flex", mt: 3 }}>
          <CircularProgress
            sx={{
              width: "24px !important",
              height: "24px !important",
              color: "#FFFFFF",
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default Splash;
