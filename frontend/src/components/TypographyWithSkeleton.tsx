import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type TypographyWithSkeletonProps = {
  isLoading: boolean;
  label?: string;
  children: ReactNode;
};

export function TypographyWithSkeleton({
  label,
  children,
  isLoading,
}: TypographyWithSkeletonProps) {
  const renderedChildren =
    typeof children === "string" ? (
      <Typography>{children}</Typography>
    ) : (
      children
    );

  if (label) {
    return (
      <Stack direction="row" gap={1}>
        <Typography whiteSpace="nowrap">{label}</Typography>
        {isLoading ? <Skeleton width="100%" /> : renderedChildren}
      </Stack>
    );
  } else {
    return isLoading ? <Skeleton width="100%" /> : renderedChildren;
  }
}
