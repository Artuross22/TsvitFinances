"use client";

import { AssetOptions, createAssetGet, createAssetPost } from "@/utils/asset";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Asset, Sector, Market, InvestmentTerm } from "@/types/asset";
import Link from "next/link";

type FormOptions = {
  sectors: Sector[];
  markets: Market[];
  investmentTerms: InvestmentTerm[];
};

const initialAsset: Partial<Asset> = {};

export default function AssetForm() {
  const [values, setValues] = useState<Partial<Asset>>(initialAsset);
  const [options, setOptions] = useState<FormOptions>({
    sectors: [],
    markets: [],
    investmentTerms: [],
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
  
    const formData = new FormData();
  
    (Object.keys(values) as Array<keyof Partial<Asset>>).forEach((key) => {
      if (key === 'charts') {
        values.charts?.forEach((file) => {
          formData.append('charts', file);
        });
      } else if (typeof values[key] === 'number') {
        formData.append(key, values[key]!.toString());
      } else if (values[key]) {
        formData.append(key, values[key] as string);
      }
      else if (typeof values[key] === 'number' && !Number.isInteger(values[key])) {
        formData.append('key',  values[key]!.toString());}     
    });
  
    try {
      await createAssetPost(formData);
    } catch (error) {
      console.error('Error in createAssetPost:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    try {
      const newFiles = Array.from(e.target.files);
      setValues(prev => ({
        ...prev,
        charts: [...(prev.charts || []), ...newFiles]
      }));
      
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    } catch (error) {
      console.error('Error in handleFileChange:', error);
    }
  };

  const removeFile = (index: number) => {
    setValues(prev => ({
      ...prev,
      charts: prev.charts?.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
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
        className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <input
          type="text"
          name="name"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Asset name"
          value={values.name}
          onChange={handleChange}
          required
        />
        <input
          type="float"
          name="currentPrice"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Current price"
          value={values.currentPrice || ''}
          onChange={handleChange}
          required
        />
        <input
          type="float"
          name="boughtFor"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Bought For"
          value={values.boughtFor || ''}
          onChange={handleChange}
        />
        <input
          type="float"
          name="quantity"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Quantity"
          value={values.quantity || ''}
          onChange={handleChange}
        />
        <input
          type="text"
          name="ticker"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Ticker"
          value={values.ticker}
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
        
        {/* File upload section */}
        <div className="w-full mb-4">
          <input
            type="file"
            name="charts"
            accept="image/jpeg,image/png"
            className="w-full px-4 py-2 border rounded-md mb-2"
            onChange={handleFileChange}
            multiple
          />
          
          <div className="grid grid-cols-2 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

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