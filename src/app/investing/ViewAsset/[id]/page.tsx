"use client";
import { getAsset } from "@/utils/asset";
import Link from "next/link";
import DeleteForm from "@/features/components/DeleteForm";
import { useEffect, useState } from "react";
import { Asset } from "@/types/asset";
import React from "react";

interface AssetProps {
  params: {
    id: string;
  };
}

const ViewAsset: React.FC<AssetProps> = ({ params }) => {
  const [asset, setAsset] = useState<Asset | null>(null);

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
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <Link href={`/investing`} className="mr-auto text-green">
          Back
        </Link>
        <h2>
          <strong>{asset.name}</strong>
        </h2>
        <div className="ml-auto flex space-x-12 text-green">
          <DeleteForm
            color="green"
            buttonName="Sell"
            root={"sellAsset"}
            id={params.id}
          />
          <DeleteForm
            color="red"
            buttonName="Delete"
            root={"deleteAsset"}
            id={params.id}
          />
        </div>
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: "lightgray",
          margin: "1%",
          padding: "2%",
        }}
      >
        <h1>{asset.name}</h1>
        <p>Ticker: {asset.ticker}</p>
        <p>Added At: {asset.addedAt.toLocaleString()}</p>
        <p>Current Price: {asset.currentPrice}</p>
        <p>Bought For: {asset.boughtFor}</p>
        <p>Quantity: {asset.quantity}</p>
        <p>Profit: {(asset.currentPrice - asset.boughtFor) * asset.quantity}</p>
        <p>
          Percentage Profit: {
            ((asset.currentPrice - asset.boughtFor) * asset.quantity) / (asset.boughtFor * asset.quantity) * 100}%
        </p>
        <p>Active: {asset.isActive ? "Yes" : "No"}</p>
        {asset.closedAt && !asset.isActive && (
          <p>Closed At: {asset.closedAt.toLocaleString()}</p>
        )}
        <div>
          <Link href={`/investing/EditAsset/${asset.id}`}>Edit</Link>
        </div>
      </div>
    </div>
  );
};
export default ViewAsset;
