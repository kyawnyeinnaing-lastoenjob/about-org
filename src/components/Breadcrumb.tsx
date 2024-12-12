import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { StyledLoadingButton } from "@/components/shared/themes/ui/styles/Button";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import {
  alpha,
  Breadcrumbs,
  breadcrumbsClasses,
  Skeleton,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { fontWeight } from "./shared/themes/fontStyles";

interface BreadcrumbProps {
  hideBack?: boolean;
  backRoute?: string;
  share?: boolean;
  loading?: boolean;
  detail?: boolean;
  breadcrumbs: {
    title: string;
    color?: string;
    link: string | null;
    bold?: boolean;
  }[];
}

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  // marginBottom: theme.spacing(3),
  [`& .${breadcrumbsClasses.separator}`]: {
    margin: theme.spacing(0, 1),
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const Breadcrumb: React.FC<BreadcrumbProps> = (props) => {
  const { breadcrumbs, hideBack = false, backRoute, loading, detail } = props;

  // const pathName = usePathname();
  // const isDetailsPage = pathName.includes('detail');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleRoute = () => {
    startTransition(() => {
      router.back();
    });
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      // sx={{ width: 'calc(100% - 470px)' }}
      sx={{ width: "100%" }}
    >
      <Stack
        direction="row"
        gap={{ xs: 2, md: 3 }}
        justifyContent="flex-start"
        alignItems="center"
        width="100%"
        // width="50%"
      >
        {loading ? (
          <Skeleton
            width={90}
            height={40}
            variant="rounded"
            sx={{ bgcolor: alpha(theme.palette.colors.black, 0.2) }}
          />
        ) : !hideBack ? (
          backRoute ? (
            <Link href={backRoute}>
              <StyledLoadingButton loading={isPending} sx={{ minWidth: 0 }}>
                <ArrowBackRoundedIcon
                  sx={{
                    width: 24,
                    height: 24,
                    color: theme.palette.colors.blue[200],
                    ...(!isMobile && { marginRight: "4px" }),
                  }}
                />
                {!isMobile && <span>Back</span>}
              </StyledLoadingButton>
            </Link>
          ) : (
            <StyledLoadingButton onClick={handleRoute} loading={isPending}>
              <ArrowBackRoundedIcon
                sx={{
                  width: 24,
                  height: 24,
                  color: theme.palette.colors.blue[200],
                  ...(!isMobile && { marginRight: "4px" }),
                }}
              />
              {!isMobile && <span>Back</span>}
            </StyledLoadingButton>
          )
        ) : (
          ""
        )}
        {loading ? (
          <Stack width="100%" direction="row" alignItems="center" spacing={2}>
            <Skeleton
              width="20%"
              sx={{ bgcolor: alpha(theme.palette.colors.black, 0.2) }}
            />
            <Skeleton
              variant="rounded"
              width={15}
              height={15}
              sx={{ bgcolor: alpha(theme.palette.colors.black, 0.2) }}
            />
            <Skeleton
              width="20%"
              sx={{ bgcolor: alpha(theme.palette.colors.black, 0.2) }}
            />
          </Stack>
        ) : (
          <StyledBreadcrumbs
            aria-label="breadcrumb"
            separator={
              <KeyboardArrowRightRoundedIcon
                fontSize="small"
                sx={{ color: theme.palette.colors.blue[200] }}
              />
            }
            sx={{
              width: {
                md: detail ? "45%" : "100%",
                xs: detail ? "100%" : "100%",
              },
              ["& .MuiBreadcrumbs-ol"]: {
                flexWrap: "nowrap",
                // columnGap: theme.spacing(5),
              },
            }}
          >
            {breadcrumbs?.map((each, key) =>
              key === breadcrumbs.length - 1 ? (
                <Typography
                  key={key}
                  variant="body1"
                  sx={{
                    color: each?.color ?? theme.palette.colors.blue[900],
                    fontWeight: fontWeight.bold,
                    fontSize: { xs: "14px", lg: "18px" },
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: 2,
                  }}
                >
                  {each?.title}
                </Typography>
              ) : (
                <Link key={key} href={each?.link || ""}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: each?.color ?? "text.primary",
                      fontSize: {
                        xs: "14px",
                        lg: "18px",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 2,
                        fontWeight: fontWeight.medium,
                      },
                    }}
                  >
                    {each?.title}
                  </Typography>
                </Link>
              ),
            )}
          </StyledBreadcrumbs>
        )}
      </Stack>
    </Stack>
  );
};

export default Breadcrumb;
