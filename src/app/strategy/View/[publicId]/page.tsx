"use client";

import { getStrategy } from "@/api/strategy";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EconomicType } from "@/types/macroeconomic";

export type GetStrategy = {
  name: string;
  description: string;
  riskManagement: RiskManagement | null;
  positionManagement: PositionManagement | null;
  financeData: FinanceData | null;
  macroeconomicEvents: MacroeconomicEvents[];
};

export type RiskManagement = {
  id: number;
  publicId: string;
  name: string;
  baseRiskPercentage: number;
  riskToRewardRatio: number;
  hedgeId: number;
  hedge: Hedge | null;
};

export type FinanceData = {
  publicId: string;
};

export type PositionManagement = {
  id: number;
  publicId: string;
  averageLevel: number;
};

export type PositionScaling = {
  publicId: string;
  equityPercentage: string;
}

export type Diversification = {
  name: string;
};

export type Hedge = {
  name: string;
};

 interface MacroeconomicEvents {
  publicId: string;
  title: string;
  economicType: EconomicType;
}

interface Props {
  params: {
    publicId: UUID;
  };
}
const ViewStrategy: React.FC<Props> = ({ params }) => {
  const [strategy, setStrategy] = useState<GetStrategy | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchAsset = async () => {
      const strategy = await getStrategy(params.publicId);
      setStrategy(strategy);
    };

    fetchAsset();
  }, [params.publicId]);

  if (!strategy) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <button onClick={() => router.back()} className="mr-auto text-green">
          Back
        </button>
        <div className="ml-auto flex space-x-12 text-green"></div>
      </div>

      <div className="container mx-auto py-8 space-y-8 px-4">
        <div className="bg-white rounded-lg border shadow-sm p-8">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-3xl font-bold text-gray-900">{strategy.name}</h5>
            <Link href={`/strategy/Edit/${params.publicId}`}>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                Edit Strategy
              </button>
            </Link>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">{strategy.description}</p>
          <div className="mt-4">
            <h6 className="text-sm font-semibold text-gray-900">Macroeconomic events that may have an impact on the hypothesis :</h6>
            <div className="mt-2 space-y-2">
              {strategy.macroeconomicEvents.map((event) => (
                <div key={event.publicId} className="flex items-center">
                  <span className={`${
                    event.economicType === EconomicType.Positive 
                      ? 'text-green-600' 
                      : 'text-red-600' 
                  }`}>
                    <Link href={`/macroeconomic/${event.publicId}`}>
                      {event.title}
                    </Link>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Risk Management
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/strategy/EditRiskManagement/${strategy.riskManagement?.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Risk Percentage</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {strategy.riskManagement?.baseRiskPercentage}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Risk Ratio</p>
                <p className="text-2xl font-semibold text-gray-900">
                  1/{strategy.riskManagement?.riskToRewardRatio}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Position Management
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/strategy/EditPositionScalingManagement/${strategy.positionManagement?.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      Position Scaling
                    </button>
                  </Link>
                  <Link
                    href={`/strategy/EditPositionManagement/${strategy.positionManagement?.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Level</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {strategy.positionManagement?.averageLevel}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Stock Metrics
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/strategy/AddStockMetrics/${strategy.financeData?.publicId}/${params.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      Add
                    </button>
                  </Link>
                  <Link
                    href={`/strategy/EditStockMetrics/${strategy.financeData?.publicId}/${params.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Diversification Overview
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/strategy/ManageDiversification/${strategy.riskManagement?.publicId}/${params.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                      Manage
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                <p className="text-lg font-medium text-gray-900">View and manage your portfolio diversification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewStrategy;