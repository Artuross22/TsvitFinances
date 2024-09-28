"use client";

import { createAsset } from "@/utils/asset";
import React, { useState } from "react";
import { Asset } from "@/types/asset";
import Link from "next/link";

const initialAsset: Partial<Asset> = {
  isActive: true,
};

export default function AssetForm() {
  const [values, setValues] = useState(initialAsset);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createAsset(values);
  };

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href={"/investing"} className="absolute left-1 text-green">
          Back
        </Link>
        <h2>
          <strong>Create Asset</strong>
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto mt-10"
      >
        <input
          type="text"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Asset name"
          value={values.name ?? ""}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
        <input
          type="number"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Current price"
          defaultValue={values.currentPrice}
          onChange={(e) =>
            setValues({
              ...values,
              currentPrice: Number(e.target.value) || undefined,
            })
          }
          required
        />
        <input
          type="number"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Bought For"
          defaultValue={values.boughtFor}
          onChange={(e) =>
            setValues({
              ...values,
              boughtFor: Number(e.target.value) || undefined,
            })
          }
        />
        <input
          type="text"
          className="px-4 py-2 border rounded-md mb-4"
          placeholder="Ticker"
          defaultValue={values.ticker}
          onChange={(e) => setValues({ ...values, ticker: e.target.value })}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Create Asset
        </button>
      </form>
    </div>
  );
}
