"use client";

import BackLink from "@/features/components/useful/BackLink";
import { listInvestmentIdeas } from "@/utils/strategy";
import { UUID } from "crypto";
import { useEffect, useState } from "react";
import Link from "next/link";


export interface ListInvestmentIdeas {
  publicId: UUID;
  name: string;
  createdAt: string;
}

export const List = () => {
  const [investmentIdeas, setInvestmentIdeas] = useState<ListInvestmentIdeas[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestmentIdeas = async () => {
      try {
        const data = await listInvestmentIdeas();
        setInvestmentIdeas(data || []);
      } catch (err) {
        setError("Failed to fetch investment ideas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentIdeas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600">Loading investment ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  const rows = investmentIdeas.reduce((acc: ListInvestmentIdeas[][], idea, index) => {
    const rowIndex = Math.floor(index / 6);
    if (!acc[rowIndex]) {
      acc[rowIndex] = [];
    }
    acc[rowIndex].push(idea);
    return acc;
  }, []);

  return (
    <>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
      <BackLink />
      <div className="ml-auto flex space-x-12 text-green"></div>
        </div>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-8xl mx-auto">
          <h6 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Failing to plan is planning to fail.
          </h6>
        <div className="space-y-8">
          {rows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
            >
              {row.map((idea) => {
                const createdAtDate = new Date(idea.createdAt);
                
                return (
                  <div
                    key={idea.publicId}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between min-h-52"
                  >
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                        {idea.name}
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        {createdAtDate.toLocaleDateString()}
                      </p>
                    </div>
                    <Link className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      href={`/InvestmentIdea/View/${idea.publicId}`}>                     
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
    </>

  );
};

export default List;