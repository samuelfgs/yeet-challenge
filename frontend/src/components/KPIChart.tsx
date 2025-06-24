import { Paper, Typography, type TypographyProps } from "@mui/material";
import { TypographyWithSkeleton } from "./TypographyWithSkeleton";

type KPIChartProps = {
  label: string;
  value: string | number;
  isLoading: boolean;
  color: TypographyProps["color"];
};

export function KPIChart({ label, value, isLoading, color }: KPIChartProps) {
  return (
    <Paper
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
        flex: 1,
        gap: 3,
      }}
    >
      <Typography variant="h6">{label}</Typography>
      <TypographyWithSkeleton isLoading={isLoading}>
        <Typography fontSize="1.5em" color={color}>
          {value}
        </Typography>
      </TypographyWithSkeleton>
    </Paper>
  );
}
