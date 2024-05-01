import EditAsset from "@/features/investing/editAsset";
import React from "react";

interface AssetProps {
  params: {
    id: string;
  };
}

const AssetDetail: React.FC<AssetProps> = ({ params }) => {
  return (
    <div>
      <EditAsset id={params.id} />
    </div>
  );
};

export default AssetDetail;
