import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { PRICE_CURRENCY_SYMBOLS, type PriceCurrency } from "@/types/project";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: PriceCurrency) {
  const symbol = PRICE_CURRENCY_SYMBOLS[currency];
  const amount = new Intl.NumberFormat("tr-TR").format(price);
  return `${symbol}${amount}`;
}

/**
 * Turkish ablative suffix ("den", "dan", "ten", "tan") for a number, based on
 * how its last word is pronounced, e.g. 100.000 → "den", 1.000.000 → "dan".
 */
export function turkishAblativeSuffix(value: number): string {
  const n = Math.round(Math.abs(value));
  const ones = ["dan", "den", "den", "ten", "ten", "ten", "dan", "den", "den", "dan"];
  const tens = ["", "dan", "den", "dan", "tan", "den", "tan", "ten", "den", "dan"];
  if (n % 10 !== 0) return ones[n % 10];
  if (n % 100 !== 0) return tens[(n / 10) % 10];
  if (n % 1000 !== 0) return "den"; // yüz
  if (n % 1_000_000 !== 0) return "den"; // bin
  return "dan"; // milyon / milyar ("sıfır" → dan as well)
}
