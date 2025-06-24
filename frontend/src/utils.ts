export function formatMoney(amountInCents: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format((amountInCents ?? 0) / 100);
}
