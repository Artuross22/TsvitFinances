export interface AccountInfo {
  accountId: string;
  alias: string;
  isPaperAccount: boolean;
}

export interface PaperAccountDate {
  AccountId: string;
  AccountTitle: string;
  DisplayName: string;
  AccountAlias: string;
  AccountStatus: string;
  Currency: string;
  Type: string;
  TradingType: boolean;
}

export interface AuthStatus {
  success: boolean;
  error: string;
  data: AuthDate | null;
}

interface AuthDate {
  authenticated: boolean;
  message: string;
}

export interface PlaceMarketOrder {
  accountId: string;
  assetPublicId: string;
  userId : string;
  side: "BUY" | "SELL";
  quantity: number;
}

export interface PlaceLimitOrder {
  accountId: string;
  assetPublicId: string;
  userId: string;
  side: "BUY" | "SELL";
  quantity: number;
  price: number;
}

export interface Orderlimits {
  orderId: string;
  accountId: string;
  contractId: string;
  ticker: string;
  orderType: string;
  status: string;
  side: string;
  quantity: number;
  remainingQuantity:string;
  price: number;
}