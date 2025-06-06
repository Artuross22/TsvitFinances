export type ViewChart = {
  name: string;
  description: string;
  chartsPath: string;
};

export interface ListCharts {
  assetPublicId: string;
  charts: _Chart[];
}

export interface _Chart {
  id: string;
  name: string;
  description: string;
  chartsPath: string;
}

export interface AddChart {
  assetId: string;
  charts: _addChart[];
}

export interface _addChart {
  name: string;
  description?: string;
  file: File;
}

export type AddAsset = {
  id: string;
  publicId: string;
  userPublicId: string;
  name: string;
  ticker: string;
  currentPrice: number;
  addedAt: Date;
  boughtFor: number;
  quantity: number;
  profit: number;
  isActive: boolean;
  closedAt: Date;
  soldFor: number;
  charts: _addChart[];

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
