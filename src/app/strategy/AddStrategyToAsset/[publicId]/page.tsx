"use client";

import { addStragyToAsset, listStrategiesForAsset } from "@/utils/strategy";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";

export type ListStrategiesForAsset = {
  publicId: string;
  name: string;
  isSetToCurrentAsset : boolean;
};

export type AddToStrategy = {
  assetPublicId: string;
  strategyPublicId: string;
};

interface Props {
  params: {
    publicId: UUID;
  };
}
 
const addStrategyToAsset: React.FC<Props> = ({ params }) => {
  const [strategies, setStrategies] = useState<ListStrategiesForAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const fetchedStrategies = await listStrategiesForAsset(params.publicId);
        setStrategies(fetchedStrategies);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load strategies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  const handleAddStrategy = async (strategyPublicId: string) => {
    try {
        
      const addToStrategyPayload: AddToStrategy = {
        assetPublicId: params.publicId,
        strategyPublicId: strategyPublicId
      };

      const success = await addStragyToAsset(addToStrategyPayload);

      if (success) {
        alert(`Strategy ${strategyPublicId} added successfully!`);
      } else {
        alert("Failed to add strategy");
      }
    } catch (error) {
      console.error("Error adding strategy to asset:", error);
      alert("An error occurred while adding the strategy");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Loading strategies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href={`/investing/ViewAsset/${params.publicId}`} className="absolute left-1 text-green">
          Back
        </Link>

        <Link
          href={`/strategy/AddStrategy`}
          className="absolute right-1 text-green"
        >
          Create
        </Link>
        <h2>
          <strong>Use Strategy</strong>
        </h2>
      </div>
      <div className="w-full p-4 border rounded-lg shadow-sm">
        <div className="grid grid-cols-6 gap-4">
          {strategies.map((strategy) => (


            <div
              key={strategy.publicId}
              className="p-4 border rounded-lg flex flex-col justify-between bg-white hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-medium mb-4 truncate">
                {strategy.name}
              </h3>
              <div className="flex flex-col space-y-2">
                <Link href={`/strategy/View/${strategy.publicId}`}>
                  <span className="w-full px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
                    Go In!
                  </span>
                </Link>
                <button 
                        className={`w-full px-4 py-2 text-sm border rounded-md 
                            ${strategy.isSetToCurrentAsset 
                                ? 'bg-blue-100 text-blue-800 cursor-default' 
                                : 'hover:bg-gray-50'}`}
                        onClick={() => !strategy.isSetToCurrentAsset && handleAddStrategy(strategy.publicId)}
                        disabled={strategy.isSetToCurrentAsset}
                    >
                        {strategy.isSetToCurrentAsset ? 'Selected' : 'Add Strategy'}
                    </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default addStrategyToAsset;