
export type ViewAssetDto = {
  userPublicId : string;
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
  charts: Chart[];
};

export type Chart = {
  name: string;
  description: string;
  chartsPath: string;
};