"use client";

import { createAssetGet, createAssetPost } from "@/utils/asset";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AddAsset, InvestmentTerm, Market, Sector, _addChart } from "@/types/AssetsDto";

type FormOptions = {
  sectors: Sector[];
  markets: Market[];
  investmentTerms: InvestmentTerm[];
};

type ChartFile = {
  name: string;
  description: string;
  file: File;
  previewUrl: string;
};

const initialAsset: Partial<AddAsset> = {
  charts: [],
};

const formatNumberInput = (value: string): string => {
  const cleaned = value.replace(/[^\d.,]/g, '');
  return cleaned.replace(',', '.');
};

const formatNumberForDisplay = (value: number | undefined): string => {
  if (value === undefined) return '';
  return value.toString().replace('.', ',');
};

export default function AssetForm() {
  const [values, setValues] = useState<Partial<AddAsset>>(initialAsset);
  const [chartFiles, setChartFiles] = useState<ChartFile[]>([]);
  const [options, setOptions] = useState<FormOptions>({
    sectors: [],
    markets: [],
    investmentTerms: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await createAssetGet();
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    return () => {
      chartFiles.forEach(chart => {
        if (chart.previewUrl) {
          URL.revokeObjectURL(chart.previewUrl);
        }
      });
    };
  }, [chartFiles]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();

    (Object.keys(values) as Array<keyof Partial<AddAsset>>).forEach((key) => {
      if (key !== "charts" && values[key] !== undefined) {
        if (typeof values[key] === "number") {
          formData.append(key, values[key]!.toString());
        } else {
          formData.append(key, values[key] as string);
        }
      }
    });

    // Add chart files
    chartFiles.forEach((chart, index) => {
      formData.append(`charts[${index}].name`, chart.name);
      formData.append(`charts[${index}].description`, chart.description);
      formData.append(`charts[${index}].file`, chart.file);
    });

    try {
      await createAssetPost(formData);
      setValues(initialAsset);
      setChartFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error in createAssetPost:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (e.target.type === "number") {
      const formattedValue = formatNumberInput(value);
      const numericValue = formattedValue ? parseFloat(formattedValue) : undefined;
      
      setValues((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      
      e.target.value = value.replace('.', ',');
    } else {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newChartFiles = files.map((file) => ({
      name: file.name,
      description: "",
      file: file,
      previewUrl: URL.createObjectURL(file)
    }));

    setChartFiles((prevCharts) => [...prevCharts, ...newChartFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleChartDescriptionChange = (index: number, description: string) => {
    setChartFiles(prevCharts => 
      prevCharts.map((chart, i) => 
        i === index ? { ...chart, description } : chart
      )
    );
  };

  const removeFile = (index: number) => {
    setChartFiles(prevCharts => {
      const chartToRemove = prevCharts[index];
      if (chartToRemove.previewUrl) {
        URL.revokeObjectURL(chartToRemove.previewUrl);
      }
      return prevCharts.filter((_, i) => i !== index);
    });
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
        className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
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
          type="text"
          inputMode="decimal"
          name="currentPrice"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Current price"
          value={formatNumberForDisplay(values.currentPrice)}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          inputMode="decimal"
          name="boughtFor"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Bought For"
          value={formatNumberForDisplay(values.boughtFor)}
          onChange={handleChange}
        />
        <input
          type="text"
          inputMode="decimal"
          name="quantity"
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Quantity"
          value={formatNumberForDisplay(values.quantity)}
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

        <div className="w-full mb-4">
          <input
            ref={fileInputRef}
            type="file"
            name="charts"
            accept="image/jpeg,image/png"
            className="w-full px-4 py-2 border rounded-md mb-2"
            onChange={handleFileChange}
            multiple
          />

          <div className="space-y-4 mt-4">
            {chartFiles.map((chart, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="relative mb-2">
                  <img
                    src={chart.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  placeholder="Chart description"
                  value={chart.description}
                  onChange={(e) => handleChartDescriptionChange(index, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={2}
                />
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