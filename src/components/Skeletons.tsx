import MediaQuery from "react-responsive";

import { Grid2 as Grid, Skeleton, Stack } from "@mui/material";

interface ItemListSkeletonProps {
  item: number;
}

export const ItemListSkeleton: React.FC<ItemListSkeletonProps> = ({ item }) => {
  return (
    <MediaQuery minWidth={768}>
      {(matches) =>
        matches ? (
          <Grid
            container
            spacing={{ xs: 1, lg: 3 }}
            rowGap={{
              xs: 1,
              md: 2,
            }}
          >
            {Array.from({ length: item }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 12, lg: 6 }} key={i}>
                <Stack direction="row">
                  <Skeleton variant="rounded" width={133} height={133} />
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    sx={{ width: "calc(100% - 133px)", p: 2 }}
                  >
                    <Stack>
                      <Skeleton />
                      <Skeleton width="50%" />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%", gap: 2 }}
                    >
                      <Skeleton variant="text" sx={{ width: "70%" }} />
                      <Skeleton variant="rounded" width={16} height={16} />
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid
            container
            spacing={{ xs: 1, lg: 3 }}
            rowGap={{
              xs: 1,
              md: 2,
            }}
          >
            {Array.from({ length: item }).map((_, i) => (
              <Grid size={{ xs: 12, lg: 6 }} key={i}>
                <Stack direction="row">
                  <Skeleton variant="rounded" width={133} height={133} />
                  <Stack
                    direction="column"
                    justifyContent="space-between"
                    sx={{ width: "calc(100% - 133px)", p: 2 }}
                  >
                    <Stack>
                      <Skeleton />
                      <Skeleton width="50%" />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%", gap: 2 }}
                    >
                      <Skeleton variant="text" sx={{ width: "70%" }} />
                      <Skeleton variant="rounded" width={16} height={16} />
                    </Stack>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        )
      }
    </MediaQuery>
  );
};
