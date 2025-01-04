"use client";
import { ViewChart } from "@/types/assetsDto";
import Link from "next/link";

export type ViewAssetDto = {
  userPublicId: string;
  strategyPublicId: string | null;
  strategyName: string | null;
  publicId: string;
  sector: string;
  term: string;
  market: string;
  name: string;
  ticker: string;
  currentPrice: number;
  quantity: number;
  boughtFor: number;
  percentageProfit: number;
  profit: number;
  addedAt: Date;
  interestOnCurrentDeposit: number;
  charts: ViewChart[];
};

interface AssetDetailsProps {
  asset: ViewAssetDto;
}

const AssetDetails = ({ asset }: AssetDetailsProps) => {
  return (
    <div className="bg-gray-300 m-2 p-4">
      <h1>{asset.name}</h1>
      <p>Ticker: {asset.ticker}</p>
      <p>Added At: {asset.addedAt.toLocaleString()}</p>
      <p>Current Price: {asset.currentPrice}</p>
      <p>Bought For: {asset.boughtFor}</p>
      <p>Quantity: {asset.quantity}</p>
      <p>Profit: {asset.profit}</p>
      <p>Percentage Profit: {asset.percentageProfit}%</p>
      <div>
        <Link href={`/investing/EditAsset/${asset.publicId}`}>Edit</Link>
      </div>
    </div>
  );
};

export default AssetDetails;
