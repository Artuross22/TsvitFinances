"use client";
import { getAsset } from "@/utils/asset";
import Link from "next/link";
import DeleteForm from "@/features/components/DeleteForm";
import { useEffect, useState } from "react";
import React from "react";
import { ViewAssetDto } from "@/types/AssetsDto";
import Image from "next/image";

interface AssetProps {
  params: {
    id: string;
  };
}

const ViewAsset: React.FC<AssetProps> = ({ params }) => {
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
      <div className="w-1/2 bg-gray-300 m-4 p-4">
        <h1>{asset.name}</h1>
        <p>Ticker: {asset.ticker}</p>
        <p>Added At: {asset.addedAt.toLocaleString()}</p>
        <p>Current Price: {asset.currentPrice}</p>
        <p>Bought For: {asset.boughtFor}</p>
        <p>Quantity: {asset.quantity}</p>
        <p>Profit: {(asset.currentPrice - asset.boughtFor) * asset.quantity}</p>
        <p>
          Percentage Profit:{" "}
          {(((asset.currentPrice - asset.boughtFor) * asset.quantity) /
            (asset.boughtFor * asset.quantity)) *
            100}
          %
        </p>
        <div>
          <Link href={`/investing/EditAsset/${asset.publicId}`}>Edit</Link>
        </div>
      </div>
      {asset?.charts && asset.charts.length > 0 && (
        <div className="flex overflow-x-auto w-1/2 bg-gray-300 m-4 p-4">
          <div>
            <Link href={`/investing/Chart/ListCharts/${asset.publicId}`}>
              View
            </Link>
            <br />
            <Link href={`/investing/Chart/AddCharts/${asset.publicId}`}>
              Add
            </Link>
          </div>
          {asset?.charts?.map((path, index) => (
            <div
              key={index}
              className="flex-none w-1/3 px-4 mb-4 flex flex-col"
            >
              <p className="flex-grow">{path.name}</p>
              <p className="flex-grow">{path.description}</p>
              <div className="w-full h-64 relative">
                <a
                  href={path.chartsPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={path.chartsPath}
                    alt={`Chart ${index}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ViewAsset;