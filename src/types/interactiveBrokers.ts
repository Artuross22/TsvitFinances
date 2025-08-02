export interface PaperAccount {
  error: string | null;
  data: PaperAccountDate[];
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