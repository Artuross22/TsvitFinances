// import React from 'react'
// import { getAllAsset } from "@/utils/asset";
"use client";

import React, { useEffect, useState } from 'react';
import { getAllAsset } from "@/utils/asset";

interface Asset {
  id: string;
  name: string;
  currentPrice: number;
  addedAt: Date;
  boughtFor: number;
  profi: number;
  active: boolean;
  closedAt: Date;
}

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
      <h2>List of Assets</h2>
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>
            <p>Name: {asset.name}</p>
            <p>Current Price: {asset.currentPrice}</p>
            {/* <p>Added At: {asset.addedAt}</p> */}
            <p>Bought For: {asset.boughtFor}</p>
            <p>Profit: {asset.profi}</p>
            <p>Active: {asset.active ? 'Yes' : 'No'}</p>
            {/* <p>Closed At: {asset.closedAt}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListAssets
