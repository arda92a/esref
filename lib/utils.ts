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
