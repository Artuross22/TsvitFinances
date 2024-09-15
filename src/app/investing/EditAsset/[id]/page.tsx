"use client";

import React, { useEffect, useState } from "react";
import { editAsset, getAsset } from "@/utils/asset";
import { Asset } from "@/types/asset";
import Link from "next/link";

const AssetForm: React.FC<{ id: string }> = ({ id }) => {
  const [formAsset, setFormAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const asset = await getAsset(id);
      setFormAsset(asset);
    };

    fetchAsset();
  }, [id]);

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
          href={`/investing/ViewAsset/${id}`}
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
        <input type="hidden" name="id" value={formAsset.id} />

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
          type="text"
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

        <input
          type="checkbox"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Bought For"
          checked={formAsset.isActive}
          onChange={(e) =>
            setFormAsset({ ...formAsset, isActive: e.target.checked })
          }
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
