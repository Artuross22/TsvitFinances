"use client";

import React, { useEffect, useState } from "react";
import { editAsset, getAsset } from "@/utils/asset";
import Link from "next/link";
import { ViewAssetDto } from "@/types/AssetsDto";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface AssetProps {
  params: {
    id: string;
  };
}

const AssetForm: React.FC<AssetProps> = ({ params }) => {
  const router = useRouter();
  const [formAsset, setFormAsset] = useState<ViewAssetDto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const asset = await getAsset(params.id);
        setFormAsset(asset);
      } catch (err) {
        console.error("Failed to load asset:", err);
      }
    };

    fetchAsset();
  }, [params.id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && formAsset) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newChart = {
          name: file.name.split('.')[0], // Use filename as chart name
          description: 'New chart description',
          chartsPath: reader.result as string,
        };
        setFormAsset({
          ...formAsset,
          charts: [...(formAsset.charts || []), newChart],
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveChart = (index: number) => {
    if (!formAsset) return;
    const newCharts = [...formAsset.charts];
    newCharts.splice(index, 1);
    setFormAsset({ ...formAsset, charts: newCharts });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formAsset) return;

    try {
      setIsSubmitting(true);
      await editAsset(formAsset);
      router.push(`/investing/ViewAsset/${params.id}`);
    } catch (err) {
      console.error("Failed to update asset:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formAsset) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center bg-gray-200 p-4 rounded-lg mb-6">
        <Link
          href={`/investing/ViewAsset/${params.id}`}
          className="text-green-600 hover:text-green-800 mr-4"
        >
          ← Back
        </Link>
        <h2 className="text-xl font-bold">Edit {formAsset.name}</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          <input type="hidden" name="id" value={formAsset.publicId} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={formAsset.name}
              onChange={(e) => setFormAsset({ ...formAsset, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticker
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md"
              value={formAsset.ticker}
              onChange={(e) => setFormAsset({ ...formAsset, ticker: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Price
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md"
              value={formAsset.currentPrice || ""}
              onChange={(e) =>
                setFormAsset({
                  ...formAsset,
                  currentPrice: parseFloat(e.target.value),
                })
              }
              required
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bought For
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-md"
              value={formAsset.boughtFor || ""}
              onChange={(e) =>
                setFormAsset({
                  ...formAsset,
                  boughtFor: parseFloat(e.target.value),
                })
              }
              required
              step="0.01"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Charts</h3>
            <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors">
              Add Chart
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formAsset.charts?.map((chart, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-4">
                <div className="mb-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded text-sm mb-1"
                    value={chart.name}
                    onChange={(e) => {
                      const newCharts = [...formAsset.charts];
                      newCharts[index] = { ...chart, name: e.target.value };
                      setFormAsset({ ...formAsset, charts: newCharts });
                    }}
                    placeholder="Chart name"
                  />
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded text-sm"
                    value={chart.description}
                    onChange={(e) => {
                      const newCharts = [...formAsset.charts];
                      newCharts[index] = { ...chart, description: e.target.value };
                      setFormAsset({ ...formAsset, charts: newCharts });
                    }}
                    placeholder="Chart description"
                  />
                </div>
                <div className="relative aspect-video w-full mb-2">
                  <Image
                    src={chart.chartsPath}
                    alt={chart.name}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                  onClick={() => handleRemoveChart(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-500 text-white rounded-md transition-colors ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Asset"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;
