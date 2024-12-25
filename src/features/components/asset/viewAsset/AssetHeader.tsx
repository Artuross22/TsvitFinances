"use client";
import Link from "next/link";
import DeleteForm from "@/features/components/DeleteForm";

interface AssetHeaderProps {
  name: string;
  assetId: string;
}

const AssetHeader = ({ name, assetId }: AssetHeaderProps) => {
  return (
    <div className="flex bg-gray-200 justify-center mt-2 px-2">
      <Link href="/investing" className="mr-auto text-green">
        Back
      </Link>
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