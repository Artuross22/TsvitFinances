"use client";
import ApplyStrategy from "@/app/strategy/ApplyStrategy/[publicId]/page";
import ApplyStockMetrics from "@/features/components/asset/viewAsset/ApplyStockMetrics";
import AssetCharts from "@/features/components/asset/viewAsset/AssetCharts";
import AssetDetails, {
} from "@/features/components/asset/viewAsset/AssetDetails";
import AssetHeader from "@/features/components/asset/viewAsset/AssetHeader";
import AssetStrategy from "@/features/components/asset/viewAsset/AssetStrategy";
import AssetTargets from "@/features/components/asset/viewAsset/AssetTargets";
import { ViewChart } from "@/types/assetsDto";
import { getAsset } from "@/api/asset";
import { useEffect, useState } from "react";

export type ViewAssetDto = {
  publicId: string;
  userPublicId: string;
  strategyPublicId: string | null;
  strategyName: string | null;
  goal: string;
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

interface AssetProps {
  params: {
    id: string;
  };
}

const ViewAsset = ({ params }: AssetProps) => {
  const [asset, setAsset] = useState<ViewAssetDto | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const asset = await getAsset(params.id);
      setAsset(asset);
    };

    fetchAsset();
  }, [params.id]);

  if (!asset) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AssetHeader name={asset.name} assetId={params.id} />

      <div className="flex">
        <div className="w-1/2 m-4 p-4">
          <AssetStrategy
            strategyPublicId={asset.strategyPublicId}
            strategyName={asset.strategyName}
            publicId={asset.publicId}
          />
          <AssetDetails asset={asset} />

          <AssetCharts
            charts={asset.charts}
            publicId={asset.publicId}
            name={asset.name}
          />

          <ApplyStockMetrics
            strategyPublicId={asset.strategyPublicId!} 
            assetPublicId={asset.publicId!}        
            />
        </div>

        <div className="w-1/2 m-4 p-4">
          <AssetTargets publicId={asset.publicId} />
          <ApplyStrategy publicId={asset.publicId} />
        </div>
      </div>
    </div>
  );
};

export default ViewAsset;
