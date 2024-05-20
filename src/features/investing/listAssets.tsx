"use client";

import React, { useEffect, useState } from "react";
import { getAllAssets } from "@/utils/asset";
import Link from "next/link";
import { Asset } from "@/types/asset";

const ListAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const fetchedAssets = await getAllAssets();
      setAssets(fetchedAssets);
    };

    fetchAssets();
  }, []);

  if (assets.length === 0) {
    return <h2 className="mt-8 font-medium text-lg">No assets to show...</h2>;
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href={`/`} className="absolute left-1 text-green">
          Back
        </Link>

        <Link
          href={`/investing/AddAsset`}
          className="absolute right-1 text-green"
        >
          Create
        </Link>
        <h2>
          <strong>List of Assets</strong>
        </h2>
      </div>
      <ul style={{ display: "flex", flexWrap: "wrap" }}>
        {assets.map(
          ({
            id,
            name,
            currentPrice,
            addedAt,
            boughtFor,
            profi,
            isActive: active,
            closedAt,
          }) => (
            <div
              key={id}
              style={{
                border: "1px solid black",
                margin: "5px",
                padding: "10px",
                width: "203px",
                height: "250px",
                backgroundColor:
                  currentPrice < boughtFor ? "lightcoral" : "lightgreen",
              }}
            >
              <li>
                <p>Name: {name}</p>
                <p>Current Price: {currentPrice}</p>
                <p>Added At: {new Date(addedAt).toLocaleDateString()}</p>
                <p>Bought For: {boughtFor}</p>
                <p>Profit: {currentPrice - boughtFor}</p>
                <p>Active: {active ? "Yes" : "No"}</p>
                {closedAt && !active && <p>Closed At: {new Date(closedAt).toLocaleDateString()}</p>}
                <div>
                  <Link href={`/investing/ViewAsset/${id}`}>
                    <span className="text-white no-underline">Go In!</span>
                  </Link>
                </div>
              </li>
            </div>
          ),
        )}
      </ul>
    </div>
  );
};

export default ListAssets;
