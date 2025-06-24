import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetUserByIdResponse } from "../types";
import config from "../config";

export function useGetUserById(id: string | undefined) {
  return useQuery<GetUserByIdResponse>({
    queryKey: ["user", id],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetch(`${config.API_BASE_URL}/api/users/${id}`);
      return await response.json();
    },
    refetchOnWindowFocus: false,
    enabled: Boolean(id),
    throwOnError: true,
  });
}
