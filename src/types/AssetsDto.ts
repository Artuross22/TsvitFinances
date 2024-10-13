


export type ViewAssetDto = {
  userPublicId : string;
  publicId: string;
  addedAt: Date;
  boughtFor: number;
  currentPrice: number;
  interestOnCurrentDeposit: number;
  market: string;
  sector: string;
  term: string;
  name: string;
  ticker: string;
  quantity: number;
  chartsPath: string[];
}