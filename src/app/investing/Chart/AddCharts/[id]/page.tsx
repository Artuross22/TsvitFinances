"use client";

import { addChart } from "@/utils/asset";
import React from "react";
import Link from "next/link";
import { _addChart, AddChart } from "@/types/AssetsDto";

interface AssetProps {
    id: string;
}

export default function AssetForm(props: AssetProps) {
  const [charts, setCharts] = React.useState<_addChart[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    const newCharts: _addChart[] = Array.from(files).map((file, index) => ({
      id: `chart-${Date.now()}-${index}`,
      name: file.name,
      description: "",
      file: file
    }));

    setCharts(prev => [...prev, ...newCharts]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const chartData: AddChart = {
        assetId: "155be901-5a85-4eeb-811d-ea8c530bcd99",
        charts: charts
      };

      console.log(chartData);
      
      const result = await addChart(chartData);
      if (result) {
        setCharts([]);
      }
    } catch (error) {
      console.error("Error in adding charts:", error);
    }
  };

  const removeFile = (index: number) => {
    setCharts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2 relative">
        <Link href="/investing" className="absolute left-1 text-green-500">
          Back
        </Link>
        <h2 className="font-bold">Create Asset</h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Charts</label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="w-full px-3 py-2 border rounded-md"
          />        
          <div className="grid grid-cols-2 gap-2 mt-4">
            {charts.map((chart, index) => (
              <div key={chart.id} className="relative">
                <img
                  src={URL.createObjectURL(chart.file)}
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
                <input
                  type="text"
                  placeholder="Chart description"
                  value={chart.description || ""}
                  onChange={(e) => {
                    const newCharts = [...charts];
                    newCharts[index].description = e.target.value;
                    setCharts(newCharts);
                  }}
                  className="w-full mt-1 px-2 py-1 text-sm border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          disabled={charts.length === 0}
        >
          Create Asset
        </button>
      </form>
    </div>
  );
}