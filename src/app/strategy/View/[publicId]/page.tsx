"use client";

import { getStrategy } from "@/api/strategy";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type GetStrategy = {
  name: string;
  riskManagement: RiskManagement | null;
  positionManagement: PositionManagement | null;
  financeData: financeData | null;
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

export type financeData = {
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
    <div>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <button onClick={() => router.back()} className="mr-auto text-green">
          Back
        </button>
        <div className="ml-auto flex space-x-12 text-green"></div>
      </div>

      <div className="container mx-auto py-6 space-y-6 px-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Risk Management
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/strategy/EditRiskManagement/${strategy.riskManagement?.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Risk Percentage</p>
                <p className="font-medium">
                  {strategy.riskManagement?.baseRiskPercentage}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Risk Ratio</p>
                <p className="font-medium">
                  1/{strategy.riskManagement?.riskToRewardRatio}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Position Management
                </h2>
                <Link
                  href={`/strategy/EditPositionScalingManagement/${strategy.positionManagement?.publicId}`}
                >
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    PositionScalingManager
                  </button>
                </Link>

                <Link
                  href={`/strategy/EditPositionManagement/${strategy.positionManagement?.publicId}`}
                >
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">          
              <div>
                <p className="text-sm text-gray-500">Average Level</p>
                <p className="font-medium">
                  {strategy.positionManagement?.averageLevel}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                    StockMetrics
                </h2>
                <Link
                  href={`/strategy/AddStockMetrics/${strategy.financeData?.publicId}/${params.publicId}`}
                >
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Add
                  </button>
                </Link>

                <Link
                  href={`/strategy/EditStockMetrics/${strategy.financeData?.publicId}/${params.publicId}`}
                  >
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Overview of diversification
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/strategy/ManageDiversification/${strategy.riskManagement?.publicId}/${params.publicId}`}
                  >
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Manage Diversification
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500"></p>
                <p className="font-medium">he</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewStrategy;
