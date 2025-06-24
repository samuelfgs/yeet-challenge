import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ListUsersResponse } from "../types";
import config from "../config";

export function useListUsers(
  page: number,
  rowsPerPage: number,
  sortBy: string,
  sortOrder: string
) {
  return useQuery<ListUsersResponse>({
    queryKey: ["users", page, rowsPerPage, sortBy, sortOrder],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/api/users?page=${page}&limit=${rowsPerPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
    throwOnError: true,
  });
}
