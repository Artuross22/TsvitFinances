import ViewAsset from "@/features/investing/viewAsset";
import React from "react";

interface AssetProps {
  params : {
    id: string;
  }
}

const AssetDetail: React.FC<AssetProps> = ({ params }) => {
  return (
    <div>
      <ViewAsset id={params.id} />
    </div>
  );
};

export default AssetDetail;
