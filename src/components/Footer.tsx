"use client";
import React from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";

import { useGetAbout } from "@/lib/swr-services/about";
import { useGetContacts } from "@/lib/swr-services/contact";
import {
  Box,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { countrySlugAtom } from "./layout/user/atoms";

const FooterStyled = styled(Box)(({ theme }) => ({
  width: "100%",
  // background: "url('/uploads/images/footer-bg.svg') no-repeat center / cover",
  // [theme.breakpoints.down("md")]: {
  //   background:
  //     "url('/uploads/images/mobile-footer-bg.png') no-repeat center / cover",
  // },
  backgroundColor: theme.palette.colors.orange[150],
  display: "flex",
}));

const Footer: React.FC = () => {
  // const theme = useTheme();
  const [countrySlug] = useAtom(countrySlugAtom);
  const { data: aboutData } = useGetAbout();
  const { data: contactData } = useGetContacts();

  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const socialList =
    contactData?.socials.map((item) => {
      return {
        status: item?.status,
        url: item?.url,
        icon: (
          <Image
            width={32}
            height={32}
            style={{ borderRadius: "100%" }}
            alt="icon"
            src={item.image || "/uploads/images/default/list.svg"}
          />
        ),
      };
    }) || [];

  return (
    <Box>
      <FooterStyled
        sx={{
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: { xs: "center", lg: "center" },
          alignItems: { xs: "center", lg: "center" },
          p: { xs: "24px 16px", sm: "24px 56px", lg: "32px 104px" },
          gap: { xs: "16px", lg: "32px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", lg: "start" },
            gap: "8px",
            "& img": {
              width: { xs: "197px", lg: "197px" },
              height: { xs: "48px", lg: "48px" },
            },
          }}
        >
          {isMobile ? (
            <Link href={`/${countrySlug}/mobile`}>
              <Image
                src={"/uploads/logo.svg"}
                width={197}
                height={48}
                alt="image"
                style={{
                  cursor: "pointer",
                }}
              />
            </Link>
          ) : (
            <Link href={`/${countrySlug}/ads`}>
              <Image
                src={"/uploads/footer-logo.svg"}
                width={197}
                height={48}
                alt="image"
                style={{
                  cursor: "pointer",
                }}
              />
            </Link>
          )}

          {isMobile ? (
            <Link href={`/${countrySlug}/mobile`}>
              <Typography
                sx={{
                  color: theme.palette.colors.orange[400],
                  textAlign: "center",
                }}
              >
                {aboutData?.data?.slogan}
              </Typography>
            </Link>
          ) : (
            <Link href={`/${countrySlug}/ads`}>
              <Typography
                sx={{
                  color: theme.palette.colors.green[100],
                  textAlign: "center",
                }}
              >
                {aboutData?.data?.slogan}
              </Typography>
            </Link>
          )}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: {
              xs: "center",
              lg: "end",
            },
            gap: "8px",
          }}
        >
          {!contactData?.socials?.every(
            (item) => item.status === "INACTIVE",
          ) && (
            <Typography
              sx={{
                color: theme.palette.colors.black,
                fontWeight: "bold",
              }}
            >
              Keep in touch with us
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: {
                xs: "12px",
                lg: "16px",
              },
            }}
          >
            {socialList?.map(
              (item, index) =>
                item.status === "ACTIVE" && (
                  <a
                    key={index}
                    href={item?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item?.icon}
                  </a>
                ),
            )}
          </Box>
        </Box>
      </FooterStyled>
      <Box
        sx={{
          width: "100%",
          padding: "16px",
          textAlign: "center",
          backgroundColor: theme.palette.colors.orange[900],
          // background: `linear-gradient(90deg, ${theme.palette.colors.blue[450]} 0%, ${theme.palette.colors.blue[400]} 100%), url('/uploads/images/header-bg.png') no-repeat center / cover`,
          color: "#FFF",
          fontSize: "12px",
        }}
      >
        © {currentYear} - {currentYear + 1} About Org. All rights reserved.
      </Box>
    </Box>
  );
};

export default Footer;
