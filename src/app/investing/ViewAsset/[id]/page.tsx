import DeleteForm from "@/features/components/DeleteForm";
import ViewAsset from "@/features/investing/viewAsset";
import React from "react";

interface AssetProps {
  params: {
    id: string;
  };
}

const AssetDetail: React.FC<AssetProps> = ({ params }) => {
  return (
    <>
      <ViewAsset id={params.id} />
    </>
  );
};

export default AssetDetail;
