"use client";

import { GetStrategy } from "@/types/strategy";
import { getStrategy } from "@/utils/strategy";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  params: {
    publicId: UUID;
  };
}
const ViewStrategy: React.FC<Props> = ({ params }) => {
  const [strategy, setStrategy] = useState<GetStrategy | null>(null);

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
        <Link href={`/strategy`} className="mr-auto text-green">
          Back
        </Link>
        <div className="ml-auto flex space-x-12 text-green"></div>
      </div>

      <div className="container mx-auto py-6 space-y-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{strategy.name}</h1>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {strategy.riskManagement?.category.name}
            </span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Risk Management</h2>
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
                <p className="text-sm text-gray-500">Hedge Strategy</p>
                <p className="font-medium">
                  {strategy.riskManagement?.hedge?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Position Management</h2>
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
        </div>
      </div>
    </div>
  );
};
export default ViewStrategy;
