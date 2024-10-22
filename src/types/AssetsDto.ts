export type ViewAssetDto = {
  userPublicId: string;
  publicId: string;
  sector: string;
  term: string;
  market: string;
  name: string;
  ticker: string;
  currentPrice: number;
  quantity: number;
  boughtFor: number;
  addedAt: Date;
  interestOnCurrentDeposit: number;
  charts: ViewChart[];
};

export type ViewChart = {
  name: string;
  description: string;
  chartsPath: string;
};

export type EditAssetDto = {
  userPublicId: string;
  publicId: string;
  sector: string;
  term: string;
  market: string;
  name: string;
  ticker: string;
  currentPrice: number;
  quantity: number;
  boughtFor: number;
  addedAt: Date;
  interestOnCurrentDeposit: number;
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

export interface UpdateChart {
  id: string;
  assetId: string;
  name: string;
  description: string | null;
}

export interface AddChart {
  assetId: string;
  charts: _addChart[];
}

export interface _addChart {
  readonly id: string;
  name: string;
  description?: string;
  file: File;
}
