"use client";

import { AssetOptions, createAssetGet, createAssetPost } from "@/utils/asset";
import React, { useEffect, useState } from "react";
import { Asset } from "@/types/asset";
import Link from "next/link";

const initialAsset: Partial<Asset> = {};

export default function AssetForm() {
  const [values, setValues] = useState<Partial<Asset>>(initialAsset);
  const [options, setOptions] = useState<Partial<Asset>>({
    sectors: [],
    markets: [],
    investmentTerms: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await createAssetGet();
        setOptions(fetchedOptions);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createAssetPost(values);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2 relative">
        <Link href={"/investing"} className="absolute left-1 text-green-500">
          Back
        </Link>
        <h2 className="font-bold">Create Asset</h2>
      </div>
  
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mx-auto mt-10 w-full max-w-md"
      >
        <input
          type="text"
          name="name"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Asset name"
          value={values.name || ""}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="currentPrice"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Current price"
          value={values.currentPrice || ""}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="boughtFor"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Bought For"
          value={values.boughtFor || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          name="quantity"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Quantity"
          value={values.quantity || ""}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ticker"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Ticker"
          value={values.ticker || ""}
          onChange={handleChange}
        />
        <select
          name="sector"
          className="w-full px-4 py-2 border rounded-md mb-4"
          onChange={handleChange}
          required
        >
          <option value="">Sector</option>
          {options.sectors?.map((sector) => (
            <option key={sector.value} value={sector.value}>
              {sector.text}
            </option>
          ))}
        </select>
        <select
          name="market"
          className="w-full px-4 py-2 border rounded-md mb-4"
          onChange={handleChange}
          required
        >
          <option value="">Market</option>
          {options.markets?.map((market) => (
            <option key={market.value} value={market.value}>
              {market.text}
            </option>
          ))}
        </select>
        <select
          name="investmentTerm"
          className="w-full px-4 py-2 border rounded-md mb-4"
          onChange={handleChange}
          required
        >
          <option value="">Term</option>
          {options.investmentTerms?.map((term) => (
            <option key={term.value} value={term.value}>
              {term.text}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Asset
        </button>
      </form>
    </div>
  );
}