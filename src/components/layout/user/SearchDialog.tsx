"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";

import { fontSize } from "@/components/shared/themes/fontStyles";
import { gray } from "@/components/shared/themes/themePrimitives";
import { useGetListingsByCountrySlug } from "@/lib/swr-services/listing";
import { SearchData } from "@/lib/swr-services/types";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
// import CancelIcon from '@mui/icons-material/Cancel';
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ClearIcon from "@mui/icons-material/Clear";
// import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  debounce,
  Dialog,
  DialogContent,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { countrySlugAtom, isSearchAtom } from "./atoms";
// import { Flex } from "@/components/shared/themes/ui/styles/Flex";

interface SearchDialogProps {
  open: boolean;
  handleClose: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ open, handleClose }) => {
  const [search, setSearch] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [listDataFromLS, setListDataFromLS] = useState([]);

  const [slug] = useAtom(countrySlugAtom);
  const [, setIsSearch] = useAtom(isSearchAtom);

  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const { data: searchData = [], isValidating } = useGetListingsByCountrySlug(
    slug,
    { search },
  );

  const debouncedSearch = useRef(
    debounce((value: string) => {
      setSearch(value);
    }, 500),
  ).current;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    debouncedSearch(value);
    setInput(value);
  };

  const handleClearSearchHistory = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("search", JSON.stringify([]));
      setListDataFromLS([]); // Update the state to clear the list
    }
  };

  const clearSearchKeyword = () => {
    setInput(input.slice(0, -1));
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = JSON.parse(localStorage.getItem("search") ?? "[]");
      const filteredData = data?.filter(
        (item: { countrySlug: string }) => item?.countrySlug === slug,
      );
      setListDataFromLS(filteredData);
    }
  }, [slug]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setSearch("");
        setInput("");
        handleClose();
      }}
      PaperProps={{
        component: "form",
        elevation: 20,
        sx: (theme) => ({
          ["&.MuiDialog-paper"]: {
            width: "600px",
            borderRadius: theme.spacing(2),
            position: "relative",
            background: "transparent",
            border: "none",
            boxShadow: "none",
          },
        }),
      }}
    >
      <DialogContent
        sx={(theme) => ({
          background: "white",
          borderRadius: theme.spacing(2),
          pt: "10px",
        })}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography
            sx={{ color: theme.palette.colors.black }}
            variant="caption"
          >
            Search
          </Typography>
          <IconButton
            sx={{ borderRadius: "50%", border: "none" }}
            onClick={() => {
              handleClose();
              setInput("");
            }}
          >
            <ClearIcon sx={{ color: theme.palette.colors.blue[200] }} />
          </IconButton>
        </Stack>
        <Box
          sx={(theme) => ({
            border: "1.5px solid",
            borderColor: theme.palette.colors.gray[300],
            borderRadius: theme.spacing(2),
            padding: "16px 0 13px",
          })}
        >
          <TextField
            inputRef={inputRef}
            value={input}
            onChange={handleChange}
            className="search"
            autoFocus
            label="Search By name"
            fullWidth
            variant="outlined"
            sx={{ "& input": { fontSize: "16px !important", height: "25px" } }}
            slotProps={{
              inputLabel: { shrink: !!search },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    {/* <SearchIcon /> */}
                    <Image
                      alt=""
                      src="/uploads/icons/search-pc.svg"
                      width={24}
                      height={24}
                    />
                  </InputAdornment>
                ),
                endAdornment: search?.length > 0 && (
                  <IconButton onClick={clearSearchKeyword}>
                    <BackspaceOutlinedIcon
                      sx={{
                        color: theme.palette.colors.gray[450],
                      }}
                    />
                  </IconButton>
                ),
              },
            }}
          />
        </Box>

        <Grid container spacing={2} rowGap={1} mt={1}>
          <Grid size={12}>
            {(searchData?.length > 0 || listDataFromLS.length > 0) && (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography sx={{ color: theme.palette.colors.gray[600] }}>
                  {search
                    ? `${searchData.length} ${searchData.length > 1 ? "Search results" : "Search result"}`
                    : "Recent history"}
                </Typography>
                {listDataFromLS.length > 0 && !search && (
                  <Button
                    variant="text"
                    sx={{
                      fontSize: fontSize.md,
                      color: theme.palette.colors.red[400],
                      p: 0,
                      height: "auto",
                    }}
                    onClick={handleClearSearchHistory}
                  >
                    Clear All
                  </Button>
                )}
              </Stack>
            )}
          </Grid>
          <Grid size={12}>
            {isValidating ? (
              <Stack spacing={1}>
                {[0, 1, 2].map((_, key) => (
                  <Stack
                    key={key}
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    width="100%"
                    gap={1}
                  >
                    <Skeleton
                      variant="rounded"
                      width={40}
                      height={40}
                      sx={{ fontSize: "1rem" }}
                    />
                    <Stack
                      width="100%"
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Skeleton
                        variant="text"
                        width={200}
                        height={30}
                        sx={{ fontSize: "1rem" }}
                      />
                      <Skeleton variant="rounded" width={15} height={15} />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            ) : search.length > 0 ? (
              searchData?.length > 0 ? (
                searchData?.map((each, key) => (
                  <Link
                    key={key}
                    href={`/${slug}/detail/${each?.mainCategory?.slug}/${each?.subCategory?.slug}/${each?.id}`}
                    onClick={() => {
                      setIsSearch(true);
                      handleClose();
                    }}
                  >
                    <List className="search-list">
                      <ListItem
                        className="search-list-item"
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            size="small"
                          >
                            <ChevronRightIcon
                              sx={{
                                color: theme.palette.colors.gray[600],
                                width: "20px !important",
                                height: "20px !important",
                              }}
                            />
                          </IconButton>
                        }
                      >
                        <Image
                          alt=""
                          src="/uploads/icons/search-history.svg"
                          width={24}
                          height={24}
                        />
                        <ListItemText
                          primary={each.title}
                          sx={{
                            ml: 1,
                            color: gray[900],
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 1,
                            maxWidth: "60%",
                            ["& span"]: {
                              fontSize: fontSize.md,
                            },
                          }}
                        />
                      </ListItem>
                    </List>
                  </Link>
                ))
              ) : (
                <NoDataUI
                  icon={
                    <Image
                      width={48}
                      height={48}
                      alt="search icon"
                      src={"/uploads/icons/no-recent-search.svg"}
                    />
                  }
                  title={"No Result Found!"}
                  desc="Please try enter different keyword"
                />
              )
            ) : listDataFromLS?.length > 0 ? (
              (listDataFromLS as SearchData).map((each, key) => (
                <Link
                  key={key}
                  onClick={() => {
                    setIsSearch(true);
                    handleClose();
                  }}
                  href={`/${each?.countrySlug}/detail/${each?.categorySlug}/${each?.subCategorySlug}/${each?.slug}`}
                >
                  <List className="search-list">
                    <ListItem
                      className="search-list-item"
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" size="small">
                          <ChevronRightIcon
                            sx={{
                              color: theme.palette.colors.gray[600],
                              width: "20px !important",
                              height: "20px !important",
                            }}
                          />
                        </IconButton>
                      }
                    >
                      <Image
                        alt=""
                        src="/uploads/icons/search-history.svg"
                        width={24}
                        height={24}
                      />
                      <ListItemText
                        primary={each.title}
                        sx={{
                          ml: 1,
                          color: gray[900],
                          ["& span"]: { fontSize: fontSize.md },
                        }}
                      />
                    </ListItem>
                  </List>
                </Link>
              ))
            ) : (
              <NoDataUI
                icon={
                  <Image
                    width={48}
                    height={48}
                    src={"/uploads/icons/no-search-result.svg"}
                    alt="no recent icon"
                  />
                }
                title={"No Search History yet!"}
                desc="Enter keyword to search"
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

interface NoDataUIProps {
  icon: string | React.ReactNode;
  title: string;
  desc: string;
}

const NoDataUI: React.FC<NoDataUIProps> = ({ icon, title, desc }) => {
  return (
    <Stack
      direction={"column"}
      alignItems={"center"}
      sx={{
        width: "100%",
        padding: 3,
        gap: 3,
        textAlign: "center",
      }}
    >
      {icon}
      <Box>
        <Typography
          sx={{
            color: gray[500],
            fontWeight: 700,
            fontSize: {
              xs: "16px",
              lg: "18px",
            },
          }}
        >
          {" "}
          {title}{" "}
        </Typography>
        <Typography
          sx={{
            color: gray[500],
            fontSize: {
              xs: "14px",
              lg: "16px",
            },
          }}
        >
          {" "}
          {desc}{" "}
        </Typography>
      </Box>
    </Stack>
  );
};

export default SearchDialog;
