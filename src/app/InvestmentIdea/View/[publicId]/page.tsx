"use client";

import React, { useEffect, useState } from 'react';
import { TrendingUp } from "lucide-react";
import { viewInvestmentIdeaPost } from "@/utils/strategy";

interface Asset {
  publicId: string;
  name: string;
}

export interface ViewInvestmentIdea {
  publicId: string;
  name: string;
  description: string;
  expectedReturn: number;
  profit?: number;
  createdAt: Date;
  assets?: Asset[];
}

interface Props {
  params: {
    publicId: string;
  };
}

const ViewInvestmentIdea = ({ params }: Props) => {
  const [investmentIdea, setInvestmentIdea] = useState<ViewInvestmentIdea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await viewInvestmentIdeaPost(params.publicId);
        setInvestmentIdea(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch investment idea');
        console.error("Error fetching investment idea:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.publicId]);

  const containerClasses = "max-w-2xl mx-auto w-full px-4 p-8";

  if (isLoading) {
    return (
      <div className={containerClasses}>
        <div className="p-6 bg-white rounded-lg shadow animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={containerClasses}>
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <p className="text-red-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!investmentIdea) {
    return (
      <div className={containerClasses}>
        <div className="p-6 text-center bg-white rounded-lg shadow">
          <p className="text-gray-500">
            Investment idea not found. Please check the ID and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{investmentIdea.name}</h2>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <p className="text-sm text-gray-500">
            Created on {new Date(investmentIdea.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600">{investmentIdea.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Expected Return</p>
            <p className="text-lg font-semibold text-green-600">
              {investmentIdea.expectedReturn}%
            </p>
          </div>
          {investmentIdea.profit !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Current Profit</p>
              <p className={`text-lg font-semibold ${
                investmentIdea.profit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {investmentIdea.profit}%
              </p>
            </div>
          )}
        </div>

        {investmentIdea.assets && investmentIdea.assets.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">Assets</p>
            <div className="flex flex-wrap gap-2">
              {investmentIdea.assets.map((asset) => (
                <span
                  key={asset.publicId}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {asset.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewInvestmentIdea;