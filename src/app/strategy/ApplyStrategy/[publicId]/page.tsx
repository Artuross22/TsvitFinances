"use client";

import React, { useEffect, useState } from "react";
import { applaStrategy } from "@/api/strategy";

interface Props {
  publicId: string;
}

export interface ApplyStrategyInput {
  position: _Position;
  risk: _Risk;
}

export interface Targets {
  start?: number | null;
  end: number;
  percentageLevel: number;
  positionScaling : number;
}

export interface _Position {
  buyTargets: Targets[];
  sellTargets: Targets[];
}

export interface _Risk {
  baseRisk: number;
  riskToReward: number;
  diversifications: Diversification[];
}

export interface Diversification {
  totalNicheSum: number;
  recommendedNichePercentage: number;
  sector: String;
  totalPercentage: number;
  currentSector: boolean;
}

export default function ApplyStrategy({ publicId }: Props) {
  const [strategies, setStrategies] = useState<ApplyStrategyInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{
    type: "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const data = await applaStrategy(publicId);
        setStrategies(data);
      } catch {
        setStatus({ type: "error", message: "Failed to load target" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTarget();
  }, [publicId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status.type === "error") {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded">{status.message}</div>
    );
  }

  if (!strategies) {
    return null;
  }

  return (
    <div className="space-y-6  m-2 p-2  bg-gray-200 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Risk Analysis</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Base Risk</div>
              <div className="text-xl font-medium">
                {strategies.risk.baseRisk}€
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">
                Minimal risk-reward ratio
              </div>
              <div className="text-xl font-medium">
                {strategies.risk.riskToReward}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Sector Diversification</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Niche Sum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recommended %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {strategies.risk.diversifications.map((div, index) => (
                    <tr
                      key={index}
                      className={
                        div.totalPercentage > div.recommendedNichePercentage
                          ? "bg-red-200"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {div.sector}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {div.totalNicheSum}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {div.recommendedNichePercentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {div.totalPercentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Position Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Buy Targets</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage Level %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Scaling Out $
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {strategies.position.buyTargets.map((target, index) => (
                    <tr key={`buy-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {target.start
                          ? `${target.start} - ${target.end}`
                          : `-`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {target.percentageLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {target.positionScaling}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Sell Targets</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Range
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage Level %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scaling In $
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {strategies.position.sellTargets.map((target, index) => (
                    <tr key={`sell-${index}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {target.start
                          ? `${target.start} - ${target.end}`
                          : `-`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {target.percentageLevel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {target.positionScaling}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
