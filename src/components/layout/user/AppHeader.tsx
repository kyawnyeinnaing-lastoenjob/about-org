"use client";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { checkCountryChangeAtom } from "@/components/pages/user/atoms";
import Select from "@/components/shared/themes/ui/Select";
import { useGetCountries } from "@/lib/swr-services/country";
import {
  SelectChangeEvent,
  Stack,
  styled,
  useMediaQuery,
  useTheme
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { Status } from "@prisma/client";

import { countrySlugAtom } from "./atoms";
import Option from "./Option";
import SearchDialog from "./SearchDialog";

const COUNTRY_LS_KEY = "countrySlug";

const Search = styled("div")(({ theme }) => ({
  borderRadius: theme.spacing(1),
  backgroundColor: `rgba(0, 0, 0, 0.05)`,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: "8px",
    alignItems: "center"
  }
}));

const StyledInputBase = styled(Box)(({ theme }) => ({
  width: 0,
  color: theme.palette.colors.gray[600],
  alignItems: "center",
  display: "none",
  opacity: 0,
  [theme.breakpoints.up("lg")]: {
    display: "flex",
    width: "240px",
    padding: "4px",
    opacity: 1
  }
}));

const AppHeader: React.FC = () => {
  const [selected, setSelected] = useState<string>("myanmar");
  const [open, setOpen] = React.useState(false);
  const [countrySlug, setCountrySlug] = useAtom(countrySlugAtom);
  const [, setCheckCountryChange] = useAtom(checkCountryChangeAtom);

  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [, slug, ...rest] = pathname.split("/");

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { data: countries } = useGetCountries();

  const filteredCountries =
    countries?.filter(
      (item) =>
        item?.status === "ACTIVE" &&
        item?.categoryCount > 0 &&
        item?.subCategoryCount > 0
    ) || [];

  const countryOptions =
    (countries &&
      filteredCountries?.map((country) => ({
        value: country?.slug,
        label: <Option src={country?.flag} name={country?.name} />
      }))) ||
    [];

  const handleCountryChange = (event: SelectChangeEvent<string>) => {
    const selectedCountry = event?.target?.value;
    // const [, , ...rest] = pathname.split('/');
    const newPathname = `/${selectedCountry}/${rest.join("/")}`;
    router.replace(newPathname);

    setSelected(selectedCountry);
    setCountrySlug(selectedCountry || selected);
    localStorage.setItem(COUNTRY_LS_KEY, selectedCountry);
    setCheckCountryChange(true);
  };

  useEffect(() => {
    if (!countries || countries.length === 0) return;

    // set default country slug
    setCountrySlug(slug);
    localStorage.setItem(COUNTRY_LS_KEY, slug);

    const countrySlugFromLS = localStorage.getItem(COUNTRY_LS_KEY) || "";
    const selectedCountry = filteredCountries?.find(
      (country) => country.slug === countrySlugFromLS
    );

    if (selectedCountry) {
      if (selectedCountry?.status === Status.INACTIVE) {
        router.push("/404");
        localStorage.removeItem(COUNTRY_LS_KEY);
      }
      setSelected(countrySlugFromLS);
      setCountrySlug(countrySlugFromLS);
    } else {
      const defaultCountrySlug = filteredCountries?.[0]?.slug || "myanmar";
      setSelected(defaultCountrySlug);
      setCountrySlug(defaultCountrySlug);
      localStorage.setItem(COUNTRY_LS_KEY, defaultCountrySlug);
    }

    //eslint-disable-next-line
  }, [countries]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={() => ({
          display: "flex",
          justifyContent: "center",
          boxShadow: 0,
          bgcolor: "background.default",
          borderBottom: `1px solid rgba(0, 0, 0, 0.05)`,
          height: 72,
          width: "100%"
        })}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          height={64}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            p: { xs: "8px 16px", sm: "8px 56px", lg: "8px 104px" }
          }}
        >
          <Box
            sx={{ ["& a"]: { display: "block", height: isMobile ? 52 : 72 } }}
          >
            {isMobile ? (
              <Link
                href={`/${countrySlug}/mobile`}
                onClick={() => router.refresh()}
              >
                <Image
                  src={"/uploads/mobile-logo.svg"}
                  alt="logo"
                  width={174}
                  height={50}
                />
              </Link>
            ) : (
              <Link
                href={`/${countrySlug}/ads`}
                onClick={() => router.refresh()}
              >
                <Image
                  src={"/uploads/logo.svg"}
                  alt="logo"
                  width={294}
                  height={72}
                />
              </Link>
            )}
          </Box>
          <Stack direction="row" gap={2}>
            <Search onClick={handleClickOpen}>
              <Stack
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: "36px",
                  height: "36px"
                }}
              >
                <Image
                  src={"/uploads/icons/search-pc.svg"}
                  alt="search icon"
                  width={isMobile ? 20 : 24}
                  height={isMobile ? 20 : 24}
                  style={{ marginTop: "1px" }}
                />
              </Stack>
              {/* <Box sx={{ width: '24px', height: '24px', display: { xs: 'inline', lg: 'none' } }}>
                <Image src={'/search-mobile.svg'} alt="search icon" width={24} height={24} />
              </Box> */}

              <StyledInputBase>Search...</StyledInputBase>
            </Search>

            <Select
              options={countryOptions}
              selected={selected}
              onChange={(e) => handleCountryChange(e)}
            />
          </Stack>
        </Stack>
      </AppBar>
      <SearchDialog open={open} handleClose={handleClose} />
    </Box>
  );
};

export default AppHeader;
