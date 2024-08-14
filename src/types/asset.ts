import { Chart } from "./chart";

export type Asset = {
  id: string;
  publicId: string;
  AppUserId: string;
  name: string;
  ticker : string;
  currentPrice: number;
  addedAt: Date;
  boughtFor: number;
  profi: number;
  isActive: boolean;
  closedAt: Date;
  charts : Chart[];
};
