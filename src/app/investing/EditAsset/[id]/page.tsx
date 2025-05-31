"use client";

import React, { useEffect, useState } from "react";
import { editAsset, editAssetGet } from "@/api/asset";
import BackLink from "@/features/components/useful/BackLink";

export type EditAssetDto = {
  userPublicId: string;
  publicId: string;
  goal: string;
  name: string;
  ticker: string;
  currentPrice: number;
  quantity: number;
  boughtFor: number;
};

interface AssetProps {
  params: {
    id: string;
  };
}

const AssetForm: React.FC<AssetProps> = ({ params }) => {
  const [formAsset, setFormAsset] = useState<EditAssetDto | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const asset = await editAssetGet(params.id);
      setFormAsset(asset);
    };

    fetchAsset();
  }, [params.id]);

  if (!formAsset) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    editAsset(formAsset);
  };

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
      <div className="absolute left-1 text-green">
        <BackLink />
        </div>
        <h2 className="text-lg">
          Edit {formAsset.name}
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto mt-10 max-w-md w-full px-4"
      >
        <input type="hidden" name="id" value={formAsset.publicId} />

        <div className="w-full mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Asset Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Asset name"
            value={formAsset.name}
            onChange={(e) => setFormAsset({ ...formAsset, name: e.target.value })}
            required
          />
        </div>


        <div className="w-full mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticker">
            Ticker Name
          </label>
          <input
            id="ticker"
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ticker name"
            value={formAsset.ticker}
            onChange={(e) =>
              setFormAsset({ ...formAsset, ticker: e.target.value })
            }
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Quantity"
            value={formAsset.quantity || ""}
            onChange={(e) =>
              setFormAsset({
                ...formAsset,
                quantity: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPrice">
            Current Price
          </label>
          <input
            id="currentPrice"
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Current Price"
            value={formAsset.currentPrice || ""}
            onChange={(e) =>
              setFormAsset({
                ...formAsset,
                currentPrice: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="w-full mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="boughtFor">
            Bought For
          </label>
          <input
            id="boughtFor"
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Bought For"
            value={formAsset.boughtFor || ""}
            onChange={(e) =>
              setFormAsset({
                ...formAsset,
                boughtFor: parseFloat(e.target.value),
              })
            }
            required
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="goal">
            Goal
          </label>
          <textarea
            id="goal"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
            placeholder="Enter your investment goal"
            value={formAsset.goal}
            onChange={(e) => setFormAsset({ ...formAsset, goal: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 font-semibold"
        >
          Update Asset
        </button>
      </form>
    </div>
  );
};

export default AssetForm;
