"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Edit, Calendar, DollarSign, Hash, Briefcase, MapPin, Target } from "lucide-react";
import { ViewAssetDto } from "@/app/investing/ViewAsset/[id]/page";

interface AssetDetailsProps {
  asset: ViewAssetDto;
}

const AssetDetails = ({ asset }: AssetDetailsProps) => {
  const isProfitable = asset.profit > 0;
  const totalValue = asset.currentPrice * asset.quantity;

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="bg-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{asset.name}</h1>
              <p className="text-gray-500 text-sm">{asset.ticker}</p>
            </div>
            <div className={`flex items-center gap-2 ${
              isProfitable ? "text-green-600" : "text-red-600"
            } text-lg font-semibold`}>
              {isProfitable ? <TrendingUp /> : <TrendingDown />}
              <span>{asset.percentageProfit.toFixed(2)}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(asset.addedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="w-4 h-4 mr-2" />
              {asset.sector}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {asset.market}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Target className="w-5 h-5" />
              Investment Goal
            </h2>
            <p className="text-gray-700 whitespace-pre-wrap break-words max-w-full overflow-hidden">{asset.goal}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Current Position
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Price:</span>
                  <span className="font-medium">${asset.currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{asset.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium">${totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Profit/Loss
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Bought For:</span>
                  <span className="font-medium">${asset.boughtFor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Profit:</span>
                  <span className={`font-medium ${
                    isProfitable ? "text-green-600" : "text-red-600"
                  }`}>
                    ${asset.profit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest on Deposit:</span>
                  <span className="font-medium">
                    ${asset.interestOnCurrentDeposit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {asset.strategyName && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Strategy</h2>
              <p className="text-gray-600">{asset.strategyName}</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href={`/investing/EditAsset/${asset.publicId}`}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Asset
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;