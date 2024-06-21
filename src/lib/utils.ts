import { GroupedTransactions, PricesByDayOfWeek, Transaction } from "@/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateNumber(num:any, maxLength:any) {
  const numStr = num.toString();
  if (numStr.length > maxLength) {
    return numStr.substring(0, maxLength) + '...';
  }
  return numStr;
}

export function groupPricesByDayOfWeek(transactions: Transaction[]): PricesByDayOfWeek {
  // Get the current date
  const currentDate: Date = new Date();
  
  // Calculate the start and end of the current week
  const currentWeekStart: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
  const currentWeekEnd: Date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 6);
  
  // Filter transactions for the current week
  const transactionsThisWeek: Transaction[] = transactions.filter((transaction: Transaction) => {
      const transactionDate: Date = new Date(transaction.created_at);
      return transactionDate >= currentWeekStart && transactionDate <= currentWeekEnd;
  });
  
  // Initialize an object to store prices grouped by day of the week
  const pricesByDayOfWeek: PricesByDayOfWeek = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: []
  };
  
  // Group prices by day of the week
  transactionsThisWeek.forEach(transaction => {
      const transactionDate: Date = new Date(transaction.created_at);
      const dayOfWeek: number = transactionDate.getDay();
      
      pricesByDayOfWeek[dayOfWeek].push(transaction.price);
  });
  
  // Ensure each day has exactly two prices
  for (const dayOfWeek in pricesByDayOfWeek) {
      const prices: number[] = pricesByDayOfWeek[parseInt(dayOfWeek)];
      if (prices.length === 1) {
          prices.push(0); // Add 0 if only one price exists for the day
      }
  }
  
  // Remove days that haven't occurred yet in the current week
  const currentDayOfWeek: number = currentDate.getDay();
  for (let i = currentDayOfWeek + 1; i < 7; i++) {
      delete pricesByDayOfWeek[i];
  }
  
  return pricesByDayOfWeek;
}

export const groupTransactionsByMonth = (transactions: Transaction[]): GroupedTransactions => {
  const groupedTransactions: GroupedTransactions = {};

  transactions.forEach(transaction => {
      const month: number = new Date(transaction.created_at).getMonth() + 1; // Adding 1 because getMonth() returns zero-based month index
      if (!groupedTransactions[month]) {
          groupedTransactions[month] = [];
      }
      groupedTransactions[month].push(transaction.price);
  });

  
  for (let i = 1; i <= 12; i++) {
      if (!groupedTransactions[i]) {
          groupedTransactions[i] = [];
      }
  }

  return groupedTransactions;
};
