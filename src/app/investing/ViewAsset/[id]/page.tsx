"use client";
import AssetCharts from "@/features/components/asset/viewAsset/AssetCharts";
import AssetDetails, {
  ViewAssetDto,
} from "@/features/components/asset/viewAsset/AssetDetails";
import AssetHeader from "@/features/components/asset/viewAsset/AssetHeader";
import AssetStrategy from "@/features/components/asset/viewAsset/AssetStrategy";
import AssetTargets from "@/features/components/asset/viewAsset/AssetTargets";
import { getAsset } from "@/utils/asset";
import { useEffect, useState } from "react";

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
        <div className="overflow-x-auto w-1/2 m-4 p-4">
          <AssetStrategy
            strategyName={asset.strategyName}
            publicId={asset.publicId}
          />
          <AssetDetails asset={asset} />
          <AssetCharts
            charts={asset.charts}
            publicId={asset.publicId}
            name={asset.name}
          />
        </div>

        <div className="overflow-x-auto w-1/2 m-4 p-4">
          <AssetTargets publicId={asset.publicId} />
        </div>
      </div>
    </div>
  );
};

export default ViewAsset;
