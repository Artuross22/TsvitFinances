'use client';

import { GetStrategy } from "@/types/strategy";
import { getStrategy } from "@/utils/strategy";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
  
interface Props {
    params: {
      publicId: UUID;
    };
  }

const ViewStrategy: React.FC<Props> = async ({ params }) => {

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
      <div className="container mx-auto py-6 space-y-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{strategy.name}</h1>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {strategy.category}
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
                <p className="font-medium">{strategy.risk.percentage}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Risk Ratio</p>
                <p className="font-medium">{strategy.risk.ratio}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hedge Strategy</p>
                <p className="font-medium">{strategy.risk.hedgeStrategy}</p>
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
                <p className="font-medium">{strategy.position.scalingOut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scaling In</p>
                <p className="font-medium">{strategy.position.scalingIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Level</p>
                <p className="font-medium">{strategy.position.averageLevel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  export default ViewStrategy;


    // export function Loading() {
    // return (
    //   <div className="flex items-center justify-center min-h-screen">
    //     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    //   </div>
    // );
  //}