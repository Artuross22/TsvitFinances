"use client";

import React, { useEffect, useState } from "react";
import { editAsset, editAssetGet } from "@/utils/asset";
import Link from "next/link";

export type EditAssetDto = {
  userPublicId: string;
  publicId: string;
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
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link
          href={`/investing/ViewAsset/${params.id}`}
          className="absolute left-1 text-green"
        >
          Back
        </Link>
        <h2>
          <strong>Edit {formAsset.name}</strong>
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto mt-10"
      >
        <input type="hidden" name="id" value={formAsset.publicId} />

        <input
          type="text"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Asset name"
          value={formAsset.name}
          onChange={(e) => setFormAsset({ ...formAsset, name: e.target.value })}
          required
        />

        <input
          type="text"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Ticker name"
          value={formAsset.ticker}
          onChange={(e) =>
            setFormAsset({ ...formAsset, ticker: e.target.value })
          }
          required
        />

        <input
          type="number"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="quantity"
          value={formAsset.quantity || ""}
          onChange={(e) =>
            setFormAsset({
              ...formAsset,
              quantity: parseFloat(e.target.value),
            })
          }
          required
        />

        <input
          type="number"
          className="px-4 py-2 border rounded-md mb-4"
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
        <input
          type="number"
          className="px-4 py-2 border rounded-md mb-4"
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
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Update Asset
        </button>
      </form>
    </div>
  );
};

export default AssetForm;
