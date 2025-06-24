import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { type SelectProps } from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { useGetRecentBets } from "../hooks/useGetRecentBets";
import { BetStatus } from "../types";
import { BarChart } from "@mui/x-charts";
import moment from "moment";
import { formatMoney } from "../utils";
import { Stack } from "@mui/material";
import { KPIChart } from "./KPIChart";

const DATE_FORMAT = "DD/MM/YYYY";

type AggregatedBetStats = {
  wagered: number;
  earned: number;
  lost: number;
  quantity: number;
};

type BetsChartProps = {
  userId: string;
};

export function BetsChart({ userId }: BetsChartProps) {
  const [daysRange, setDaysRange] = useState(7);

  const { data: bets, isLoading } = useGetRecentBets(`${userId}`, daysRange);

  const handleDaysRangeChange: SelectProps<number>["onChange"] = (event) => {
    setDaysRange(event.target.value);
  };

  const aggregatedBetStatsPerDay = useMemo(() => {
    if (!bets) {
      return {};
    }
    return bets.reduce((aggregatedBetsPerDay, bet) => {
      const day = moment(bet.createdAt).format(DATE_FORMAT);
      if (!(day in aggregatedBetsPerDay)) {
        aggregatedBetsPerDay[day] = {
          quantity: 0,
          wagered: 0,
          earned: 0,
          lost: 0,
        };
      }
      const stats = aggregatedBetsPerDay[day];

      stats.quantity += 1;
      stats.wagered += bet.wagerAmount;
      if (bet.status === BetStatus.WIN) {
        stats.earned += Math.floor(bet.wagerAmount * (+bet.multiplier - 1));
      } else if (bet.status === BetStatus.LOSS) {
        stats.lost += bet.wagerAmount;
      }

      return aggregatedBetsPerDay;
    }, {} as Record<string, AggregatedBetStats>);
  }, [bets]);

  const barChartDataset = useMemo(
    () =>
      Object.entries(aggregatedBetStatsPerDay)
        .map(([day, stats]) => ({
          day,
          diff: stats.earned - stats.lost,
        }))
        .sort((a, b) =>
          moment(a.day, DATE_FORMAT).diff(moment(b.day, DATE_FORMAT))
        ),
    [aggregatedBetStatsPerDay]
  );

  const aggregatedBetStatsForPeriod = useMemo(
    () =>
      Object.values(aggregatedBetStatsPerDay).reduce(
        (acc, dailyStats) => ({
          quantity: acc.quantity + dailyStats.quantity,
          earned: acc.earned + dailyStats.earned,
          lost: acc.lost + dailyStats.lost,
          wagered: acc.wagered + dailyStats.wagered,
        }),
        {
          quantity: 0,
          earned: 0,
          lost: 0,
          wagered: 0,
        }
      ),
    [aggregatedBetStatsPerDay]
  );

  return (
    <Paper
      sx={{
        maxWidth: "900px",
        width: "100%",
        padding: 4,
        marginTop: 2,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5"> See recent activity</Typography>
      <Select
        value={daysRange}
        onChange={handleDaysRangeChange}
        sx={{ width: "80%" }}
      >
        <MenuItem value={7}>Last 7 days</MenuItem>
        <MenuItem value={15}>Last 15 days</MenuItem>
        <MenuItem value={30}>Last 30 days</MenuItem>
      </Select>
      <Paper
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          padding={4}
          gap={3}
          width="100%"
        >
          <KPIChart
            label="Total Bets"
            value={aggregatedBetStatsForPeriod.quantity}
            isLoading={isLoading}
            color="textSecondary"
          />
          <KPIChart
            label="Total wagered"
            value={formatMoney(aggregatedBetStatsForPeriod.wagered)}
            isLoading={isLoading}
            color="textSecondary"
          />
          <KPIChart
            label="Total Earned"
            value={formatMoney(aggregatedBetStatsForPeriod.earned)}
            isLoading={isLoading}
            color="success"
          />
          <KPIChart
            label="Total Lost"
            value={formatMoney(aggregatedBetStatsForPeriod.lost)}
            isLoading={isLoading}
            color="error"
          />
        </Stack>
        <BarChart
          height={300}
          width={700}
          dataset={barChartDataset}
          xAxis={[
            {
              dataKey: "day",
            },
          ]}
          yAxis={[
            {
              colorMap: {
                type: "piecewise",
                thresholds: [0],
                colors: ["red", "green"],
              },
            },
          ]}
          series={[
            { dataKey: "diff", label: "Money", valueFormatter: formatMoney },
          ]}
          loading={isLoading}
          hideLegend
        />
      </Paper>
    </Paper>
  );
}
