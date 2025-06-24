import { useQuery } from "@tanstack/react-query";
import config from "../config";
import { type GetRecentBetsResponse } from "../types";

export function useGetRecentBets(id: string | undefined, daysLimit: number) {
  return useQuery<GetRecentBetsResponse>({
    queryKey: ["user", id, "recent-bets", daysLimit],
    queryFn: async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users/${id}/recent-bets?daysLimit=${daysLimit}`
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
    throwOnError: true,
  });
}
