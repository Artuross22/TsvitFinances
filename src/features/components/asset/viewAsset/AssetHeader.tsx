"use client";
import DeleteForm from "@/features/components/DeleteForm";
import BackLink from "../../useful/BackLink";

interface AssetHeaderProps {
  name: string;
  assetId: string;
}

<div className="flex bg-gray-200 justify-center mt-2 px-2">
<div className="ml-auto flex space-x-12 text-green"></div>
</div>

const AssetHeader = ({ name, assetId }: AssetHeaderProps) => {
  return (
    <div className="flex bg-gray-200 justify-center mt-2 px-2">
      <div className="mr-auto text-green">
        <BackLink />
      </div>

      <h2>
        <strong>{name}</strong>
      </h2>
      <div className="ml-auto flex space-x-12 text-green">
        <DeleteForm
          color="green"
          buttonName="Sell"
          root="sellAsset"
          id={assetId}
        />
        <DeleteForm
          color="red"
          buttonName="Delete"
          root="deleteAsset"
          id={assetId}
        />
      </div>
    </div>
  );
};

export default AssetHeader;
