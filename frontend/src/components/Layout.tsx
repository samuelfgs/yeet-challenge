import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Avatar from "@mui/material/Avatar";
import { Link, Skeleton } from "@mui/material";
import { useLoggedInAdmin } from "../hooks/useLoggedInAdmin";
import { TypographyWithSkeleton } from "./TypographyWithSkeleton";
import ErrorBoundary from "./ErrorBoundary";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { data, isLoading } = useLoggedInAdmin();

  return (
    <Stack width="100%" alignItems="start" justifyContent="center" gap={3}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          width: "100%",
        }}
        padding={2}
        bgcolor="primary.main"
      >
        <Link href="/" underline="none">
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "center", mr: "auto" }}
          >
            <CustomIcon />
            <Typography variant="h5" color="common.white">
              Yeet VIP Support
            </Typography>
          </Stack>
        </Link>
        <Stack direction="row" alignItems="center" gap={2}>
          <TypographyWithSkeleton isLoading={isLoading}>
            <Typography color="common.white">
              Admin: {data?.firstName} {data?.lastName}
            </Typography>
          </TypographyWithSkeleton>
          {isLoading ? <Skeleton /> : <Avatar src={data?.avatar} />}
        </Stack>
      </Stack>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Stack>
  );
}

export function CustomIcon() {
  return (
    <Box
      sx={{
        width: "1.5rem",
        height: "1.5rem",
        bgcolor: "black",
        borderRadius: "999px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundImage:
          "linear-gradient(135deg, hsl(210, 98%, 60%) 0%, hsl(210, 100%, 35%) 100%)",
        color: "hsla(210, 100%, 95%, 0.9)",
        border: "1px solid",
        borderColor: "hsl(210, 100%, 55%)",
        boxShadow: "inset 0 2px 5px rgba(255, 255, 255, 0.3)",
      }}
    >
      <DashboardRoundedIcon color="inherit" sx={{ fontSize: "1rem" }} />
    </Box>
  );
}
