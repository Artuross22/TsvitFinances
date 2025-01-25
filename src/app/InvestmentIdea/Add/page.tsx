"use client";

import BackLink from "@/features/components/useful/BackLink";
import {
  createInvestmentIdeaGet,
  createInvestmentIdeaPost,
} from "@/utils/strategy";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface AddInvestmentIdeaPost {
  appUserId: string;
  name: string;
  description: string;
  expectedReturn: number;
  profit?: number | null;
  assets: AddInvestmentIdeaGet[] | [];
}

export interface AddInvestmentIdeaGet {
  publicId: string;
  name: string;
}

const AddInvestmentIdea = () => {
  const [investmentIdea, setInvestmentIdea] = useState<AddInvestmentIdeaGet[]>(
    [],
  );
  const [selectedAssets, setSelectedAssets] = useState<AddInvestmentIdeaGet[]>(
    [],
  );
  const [formData, setFormData] = useState<AddInvestmentIdeaPost>({
    appUserId: "",
    name: "",
    description: "",
    expectedReturn: 0,
    profit: null,
    assets: [],
  });

  useEffect(() => {
    const fetchDiversifications = async () => {
      const data = await createInvestmentIdeaGet();
      setInvestmentIdea(data || []);
    };

    fetchDiversifications();
  }, []);

  const handleAssetChange = (asset: AddInvestmentIdeaGet) => {
    setSelectedAssets((prev) => {
      const isSelected = prev.some((a) => a.publicId === asset.publicId);
      if (isSelected) {
        return prev.filter((a) => a.publicId !== asset.publicId);
      }
      return [...prev, asset];
    });

    setFormData((prev) => {
      const isSelected = prev.assets.some((a) => a.publicId === asset.publicId);
      return {
        ...prev,
        assets: isSelected
          ? prev.assets.filter((a) => a.publicId !== asset.publicId)
          : [...prev.assets, asset],
      };
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "expectedReturn" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const postData: AddInvestmentIdeaPost = {
        ...formData,
        assets: selectedAssets,
      };

      await createInvestmentIdeaPost(postData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <BackLink />
        <div className="ml-auto flex space-x-12 text-green"></div>
      </div>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Investment Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter investment name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Enter investment description"
            />
          </div>

          <div>
            <label
              htmlFor="expectedReturn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expected Return (%)
            </label>
            <input
              type="number"
              id="expectedReturn"
              name="expectedReturn"
              step="0.01"
              value={formData.expectedReturn || ""}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter expected return"
            />
          </div>

          <div>
            <label
              htmlFor="profit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Profit (optional)
            </label>
            <input
              type="number"
              id="profit"
              name="profit"
              step="0.01"
              value={formData.profit || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter profit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Assets
            </label>
            <div className="grid grid-cols-2 gap-4">
              {investmentIdea.map((asset) => (
                <div
                  key={asset.publicId}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={asset.publicId}
                    checked={selectedAssets.some(
                      (a) => a.publicId === asset.publicId,
                    )}
                    onChange={() => handleAssetChange(asset)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={asset.publicId}
                    className="text-sm text-gray-700"
                  >
                    {asset.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create Investment Idea
          </button>
        </form>
      </div>
    </>
  );
};

export default AddInvestmentIdea;
