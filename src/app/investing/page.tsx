"use client";

import React, { useEffect, useState } from "react";
import { getAllAssets } from "@/utils/asset";
import Link from "next/link";
import { Asset } from "@/types/asset";
import BackLink from "@/features/components/useful/BackLink";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

const ListAssets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const fetchedAssets = await getAllAssets();
      setAssets(fetchedAssets);
    };

    fetchAssets();
  }, []);

  if (assets.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex justify-between items-center w-64">
          <h2 className="font-medium text-lg">No assets to show...</h2>
          <Link
            href={`/investing/AddAsset`}
            className="bg-green-500 text-black px-4 py-2 rounded"
          >
            Create
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <div className="absolute left-1 text-green">
          <BackLink />
        </div>
        <Link
          href={`/investing/AddAsset`}
          className="absolute right-1 text-green"
        >
          Create
        </Link>
        <h2>
          <strong>List of Assets</strong>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {assets.map(
          ({
            id,
            name,
            publicId,
            currentPrice,
            addedAt,
            boughtFor,
            profit,
            isActive: active,
            closedAt,
            quantity,
          }) => {
            const profitPercentage = (((currentPrice - boughtFor) * quantity) /
              (boughtFor * quantity)) *
              100;
            const isProfitable = currentPrice >= boughtFor;

            return (
              <div
                key={id}
                className={`rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
                  isProfitable ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg truncate">{name}</h3>
                    {isProfitable ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Price:</span>
                      <span className="font-medium">${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bought For:</span>
                      <span className="font-medium">${boughtFor.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit:</span>
                      <span className={isProfitable ? "text-green-600" : "text-red-600"}>
                        ${(currentPrice - boughtFor).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit %:</span>
                      <span className={isProfitable ? "text-green-600" : "text-red-600"}>
                        {profitPercentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <div>Added: {new Date(addedAt).toLocaleDateString()}</div>
                    {closedAt && !active && (
                      <div>Closed: {new Date(closedAt).toLocaleDateString()}</div>
                    )}
                  </div>

                  <Link 
                    href={`/investing/ViewAsset/${publicId}`}
                    className={`mt-2 flex items-center justify-center gap-2 p-2 rounded-md w-full ${
                      isProfitable 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-red-500 hover:bg-red-600"
                    } text-white transition-colors`}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ListAssets;