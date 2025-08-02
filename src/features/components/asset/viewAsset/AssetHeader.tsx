"use client";
import DeleteForm from "@/features/components/DeleteForm";
import BackLink from "../../useful/BackLink";
import Link from "next/link";

interface AssetHeaderProps {
  name: string;
  assetId: string;
}

<div className="flex bg-gray-200 justify-center mt-2 px-2">
  <div className="ml-auto flex space-x-12 text-green"></div>
</div>;

const AssetHeader = ({ name, assetId }: AssetHeaderProps) => {
  return (
    <div className="flex bg-gray-200 justify-center mt-2 px-2">
      <div className="mr-auto flex space-x-12 text-green">
        <BackLink />

        <Link href={`/ibManagement/Trading/${assetId}`}>
        <span className="text-green-600 no-underline hover:text-red-300">
          Trading
        </span>
      </Link>
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
