import { keepPreviousData, useQuery } from "@tanstack/react-query";
import config from "../config";
import { type GetUserTransactionsResponse } from "../types";

export function useGetUserTransactions(
  userId: string | undefined,
  page: number,
  limit: number
) {
  return useQuery<GetUserTransactionsResponse>({
    queryKey: ["user", userId, "transactions"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users/${userId}/transactions?page=${page}&limit=${limit}`
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(userId),
    throwOnError: true,
  });
}
