"use client";

import { RiskCategory } from "@/types/strategy";
import { getStrategy } from "@/utils/strategy";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type GetStrategy = {
  name: string;
  riskManagement: RiskManagement | null;
  positionManagement: PositionManagement | null;
};

export type RiskManagement = {
  id: number;
  publicId: string;
  name: string;
  category: number;
  baseRiskPercentage: number;
  riskToRewardRatio: number;
  hedgeId: number;
  hedge: Hedge | null;
};

export type PositionManagement = {
  id: number;
  publicId: string;
  scalingOut: number | null;
  scalingIn: number | null;
  averageLevel: number;
};

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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{strategy.name}</h1>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {strategy.riskManagement?.category &&
                RiskCategory[strategy.riskManagement.category]}
            </span>
          </div>
        </div>

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
              <div>
                <p className="text-sm text-gray-500">Risk Category</p>
                <p className="font-medium">
                  {RiskCategory[strategy.riskManagement?.category ?? 0]}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hedge Strategy</p>
                <p className="font-medium">
                  {strategy.riskManagement?.hedge?.name}
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
                <p className="text-sm text-gray-500">Scaling Out</p>
                <p className="font-medium">
                  {strategy.positionManagement?.scalingOut}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scaling In</p>
                <p className="font-medium">
                  {strategy.positionManagement?.scalingIn}%
                </p>
              </div>
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
