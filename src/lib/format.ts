import { site } from "./site";

export function formatPrice(amount: number): string {
  return `${site.currencySymbol}${amount.toLocaleString("en-IN")}`;
}
