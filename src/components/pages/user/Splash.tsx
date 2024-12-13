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
        // background: `linear-gradient(90deg, #14046A 0%, #170481 100%)`,
        background: "url('/uploads/loading.svg') no-repeat center / cover",
      })}
    >
      <Stack
        height="100%"
        direction="column"
        justifyContent="center"
        alignItems="center"
        rowGap={2}
      >
        <Image
          src={"/uploads/logo-white.svg"}
          alt="logo"
          width={226}
          height={72}
        />
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, mt: 3 }}>
          <CircularProgress
            sx={{
              width: "24px !important",
              height: "24px !important",
              color: "#FFFFFF",
            }}
          />
          <Typography color="#FFFFFF">Loading...</Typography>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Splash;
