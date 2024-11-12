'use client';

import { ListStrategies } from "@/types/strategy";
import { listStrategies } from "@/utils/strategy";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ListStrategies() {
  const [strategies, setStrategies] = useState<ListStrategies[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const fetchedStrategies = await listStrategies();
        setStrategies(fetchedStrategies);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrategies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Loading strategies...</p>
      </div>
    );
  }

  return (
<div> 
    <div className="flex bg-gray-200 justify-center mt-2">
    <Link href={`/`} className="absolute left-1 text-green">
      Back
    </Link>

    <Link
      href={`/strategy/AddStrategy`}
      className="absolute right-1 text-green"
    >
      Create
    </Link>
    <h2>
      <strong>Investment Strategies</strong>
    </h2>
  </div>
    <div className="w-full p-4 border rounded-lg shadow-sm">
      <div className="grid grid-cols-6 gap-4">
        {strategies.map((strategy, index) => (
          <div 
            key={index} 
            className="p-4 border rounded-lg flex flex-col justify-between bg-white hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium mb-4 truncate">{strategy.name}</h3>
            <div className="flex flex-col space-y-2">

            <Link href={`/strategy/View/${strategy.publiceId}`}>
                    <span className="w-full px-4 py-2 text-sm border rounded-md hover:bg-gray-50">Go In!</span>
            </Link>          
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}