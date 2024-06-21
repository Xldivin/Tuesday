export interface UserProfile {
    id: number;
    username: string | null;
    first_name: string;
    last_name: string;
    email: string;
    recovery_email: string | null;
    password: string;
    phone_number: string;
    country_code: string;
    image_url: string | null;
    account_balance: number;
    ledger_balance: number;
    kyc_verified: boolean;
    email_verified: boolean;
    date_of_birth: string | null;
    gender: string;
    occupation: string;
    country: string;
    city: string;
    address: string;
    role: string;
    token: string | null;
    created_at: string;
    history: number[];
    lastChange: number;
    holdingsBalance: number;
    currency: string;
}

export interface Transaction {
    created_at: string;
    price: number;
}
  
export interface PricesByDayOfWeek {
    [key: number]: number[];
}
  
export interface GroupedTransactions {
    [month: number]: number[];
}

export interface VolumeTradedToday {
    volume: number;
}

export interface StockInfo {
    id: number;
    name: string;
    image: string;
    symbol: string;
    category: string;
    exchange: string;
    currency: string;
    percentageChange: number;
    movement: string;
    dayRangeHigh: number;
    dayRangeLow: number;
    yearRangeHigh: number;
    yearRangeLow: number;
    price: number;
    initialNumber: number | null;
    initialPrice: number | null;
    VolumeTradedToday: VolumeTradedToday[];
    prices: number[];
    dates: string[];
    availableToBuy: number;
    availableToSell: number;
    lastChange: number;
}

export interface Order {
    type: string;
    amount: number;
    symbol: string;
    action: string;
    status: string;
    user_id: number;
    stock_id: number;
    unit_price: number;
    filled_amount: number;
    filled_average_price: number;
    limit_price: number;
    stop_price: number;
}