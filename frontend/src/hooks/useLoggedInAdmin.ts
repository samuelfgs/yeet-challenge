import { useQuery } from "@tanstack/react-query";
import type { StaffMember } from "../types";
import config from "../config";

export function useLoggedInAdmin() {
  return useQuery<StaffMember>({
    queryKey: ["admin"],
    queryFn: async () => {
      const response = await fetch(
        `${config.API_BASE_URL}/api/admin/logged-in`
      );
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });
}
