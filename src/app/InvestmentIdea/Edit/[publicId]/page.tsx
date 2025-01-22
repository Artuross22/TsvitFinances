"use client";

import React, { useEffect, useState } from "react";
import { EditInvestmentIdeaGet, InvestmentIdeaPost } from "@/utils/strategy";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export interface EditInvestmentIdea {
  publicId: string;
  name: string;
  description: string;
  expectedReturn: number;
  profit?: number;
  createdAt: Date;
  assets?: Asset[];
}

interface Asset {
  publicId: string;
  name: string;
}

interface Props {
  params: {
    publicId: string;
  };
}

const Edit = ({ params }: Props) => {
  const [investmentIdea, setInvestmentIdea] = useState<EditInvestmentIdea>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    expectedReturn: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await EditInvestmentIdeaGet(params.publicId);
        setInvestmentIdea(data);
        setFormData({
          name: data.name,
          description: data.description,
          expectedReturn: data.expectedReturn,
        });
      } catch (err) {
        setError("Failed to load investment idea");
      }
    };

    fetchData();
  }, [params.publicId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    //   await InvestmentIdeaPost(formData);

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expectedReturn' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <>
      <div className="flex bg-gray-200 items-center px-4 py-2 mt-2">
        <Link href={`/investing/ViewInvestmentIdea/${params.publicId}`} 
          className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span className="ml-1">Back</span>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto mt-6 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-xl font-semibold mb-6">Edit Investment Idea</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  name="expectedReturn"
                  value={formData.expectedReturn}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {investmentIdea?.assets && investmentIdea.assets.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Assets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {investmentIdea.assets.map((asset) => (
                      <div
                        key={asset.publicId}
                        className="px-3 py-1 bg-gray-100 rounded text-sm text-gray-600"
                      >
                        {asset.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={20} className="mr-2" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Edit;