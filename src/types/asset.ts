import { Chart } from "./chart";

export type Asset = {
  id: string;
  publicId: string;
  userPublicId: string;
  name: string;
  ticker: string;
  currentPrice: number;
  addedAt: Date;
  boughtFor: number;
  quantity : number;
  profit: number;
  isActive: boolean;
  closedAt: Date;
  soldFor: number;
  charts: Chart[];

    sectors: Sector[];  
    markets: Market[];
    investmentTerms: InvestmentTerm[];
};

export type Sector = {
  value: number;
  text: string;
};

export type Market = {
  value: number;
  text: string;
};

export type InvestmentTerm = {
  value: number;
  text: string;
};
