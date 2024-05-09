"use client";

import React, { useEffect, useState } from "react";
import { getAllAsset } from "@/utils/asset";
import Link from "next/link";
import { Asset } from "@/types/asset";


const ListAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const fetchedAssets = await getAllAsset();
      setAssets(fetchedAssets);
    };

    fetchAssets();
  }, []);

  if (assets.length === 0) {
    return <h2 className="mt-8 font-medium text-lg">No assets to show...</h2>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>List of Assets</h2>
      </div>
      <ul style={{ display: "flex" }}>
        {assets.map(
          ({
            id,
            name,
            currentPrice,
            addedAt,
            boughtFor,
            profi,
            active,
            closedAt,
          }) => (
            <div
              key={id}
              style={{
                border: "1px solid black",
                margin: "5px",
                padding: "10px",
                backgroundColor:
                  currentPrice < boughtFor ? "lightcoral" : "lightgreen",
              }}
            >
              <li>
                <p>Name: {name}</p>
                <p>Current Price: {currentPrice}</p>
                <p>Added At: {new Date(addedAt).toLocaleDateString()}</p>
                <p>Bought For: {boughtFor}</p>
                <p>Profit: {profi}</p>
                <p>Active: {active ? "Yes" : "No"}</p>
                <p>Closed At: {new Date(closedAt).toLocaleDateString()}</p>
                <p>
                  <div className="flex gap-6 items-center">
                    <Link
                      href={`/investing/ViewAsset/${id}`}
                      className="btn btn-accent btn-xs"
                    >
                      <span style={{ color: "white", textDecoration: "none" }}>
                        Go In!
                      </span>
                    </Link>
                  </div>
                </p>
              </li>
            </div>
          ),
        )}
      </ul>
    </div>
  );
};

export default ListAssets;
