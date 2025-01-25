"use client";

import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { deleteInvestmentIdea, viewInvestmentIdea } from "@/utils/strategy";
import Link from 'next/link';
import BackLink from '@/features/components/useful/BackLink';

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
        const data = await viewInvestmentIdea(params.publicId);
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

  const handleDelete = async () => {
    if (!investmentIdea) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete the investment idea "${investmentIdea.name}"?`);
    
    if (confirmDelete) {
      try {
        await deleteInvestmentIdea(investmentIdea.publicId);
      } catch (err) {
        console.error("Error deleting investment idea:", err);
        alert('Failed to delete investment idea');
      }
    }
  };

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
    <>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
          <BackLink />
          <div className="ml-auto flex space-x-12 text-green"></div>
      </div>
    <div className={containerClasses}>
    <div className="flex justify-end space-x-3">
        <Link
            href={`/InvestmentIdea/Edit/${investmentIdea.publicId}`}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
            <Pencil size={16} />
            <span className="text-sm font-medium">Edit</span>
        </Link>
        <button
            onClick={handleDelete}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
        >
            <Trash2 size={16} />
            <span className="text-sm font-medium">Delete</span>
        </button>
    </div>
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
          <div className="border-t pt-6 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Assets</p>
            <div className="flex flex-wrap gap-3">
              {investmentIdea.assets.map((asset) => (
                <div
                  key={asset.publicId}
                  className="group flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-sm text-gray-700">{asset.name}</span>
                  <Link 
                    href={`/investing/ViewAsset/${asset.publicId}`}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    View →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ViewInvestmentIdea;