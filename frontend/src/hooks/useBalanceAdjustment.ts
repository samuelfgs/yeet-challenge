import { useMutation, useQueryClient } from "@tanstack/react-query";
import config from "../config";

export function useBalanceAdjustment(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["balance-adjustment", userId],
    mutationFn: async ({
      type,
      amount,
      comment,
    }: {
      type: "debit" | "credit";
      amount: number;
      comment?: string;
    }) => {
      const response = await fetch(
        `${config.API_BASE_URL}/api/admin/adjust-user-balance`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId,
            type,
            amount,
            comment,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      queryClient.invalidateQueries({
        queryKey: ["user", userId],
      });
    },
  });
}
