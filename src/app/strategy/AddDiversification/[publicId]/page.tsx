"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createStrategy } from "@/utils/strategy";
import Link from "next/link";

export type AddDiversification = {
  publicId: string;
  nichePercentage: number;
  sector: Sector;
};

export enum Sector {
  Technology = 100,
  Industrials,
  HealthCare,
  RealEstate,
  Energy,
  RenewableEnergy,
  Financials,
  Utilities,
  ConsumerStaples,
  Materials,
  CommunicationServices,
  ConsumerDiscretionary,
  Crypto = 200,
}

const initialStrategy: AddDiversification = {
  publicId: "",
  nichePercentage: 0,
  sector: Sector.Technology,
};

export default function AddStrategy(publicId: string) {
  const router = useRouter();
  const [strategies, setStrategies] = useState<AddDiversification[]>([{ ...initialStrategy }]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const calculateTotalPercentage = (currentStrategies: AddDiversification[]): number => {
    return currentStrategies.reduce((sum, strategy) => sum + (strategy.nichePercentage || 0), 0);
  };

  const handleChange = (index: number, field: keyof AddDiversification, value: string) => {
    const newStrategies = [...strategies];
    
    if (field === 'nichePercentage') {
      const numValue = Math.max(0, Math.min(100, Number(value) || 0));
      const otherStrategiesTotal = calculateTotalPercentage(strategies.filter((_, i) => i !== index));
      
      if (otherStrategiesTotal + numValue > 100) {
        const maxAllowed = 100 - otherStrategiesTotal;
        newStrategies[index] = {
          ...newStrategies[index],
          [field]: Math.max(0, maxAllowed)
        };
        setMessage(`Maximum allowed percentage for this strategy is ${maxAllowed}%`);
      } else {
        newStrategies[index] = {
          ...newStrategies[index],
          [field]: numValue
        };
        setMessage("");
      }
    } else if (field === 'sector') {
      newStrategies[index] = {
        ...newStrategies[index],
        [field]: Number(value)
      };
    }

    setStrategies(newStrategies);
  };

  const handleAddStrategy = () => {
    const currentTotal = calculateTotalPercentage(strategies);
    if (currentTotal >= 100) {
      setMessage("Cannot add more strategies - total allocation already at 100%");
      return;
    }
    setStrategies([...strategies, { ...initialStrategy }]);
    setMessage("");
  };

  const handleRemoveStrategy = (index: number) => {
    setStrategies(strategies.filter((_, i) => i !== index));
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const totalPercentage = calculateTotalPercentage(strategies);
    if (totalPercentage > 100) {
      setMessage("Total allocation cannot exceed 100%");
      setIsLoading(false);
      return;
    }

    try {
      await createStrategy(strategies);
      setMessage("Strategies created successfully!");
      router.push("/strategy");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPercentage = calculateTotalPercentage(strategies);
  const isValid = totalPercentage <= 100 && totalPercentage > 0;

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href="/strategy" className="absolute left-1 text-green-600">
          Back
        </Link>
        <h2>
          <strong>Create Strategies</strong>
        </h2>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Add New Strategies</h1>
            <div className="text-sm">
              Total Allocation: {totalPercentage}%
              {totalPercentage > 100 && (
                <span className="text-red-500 ml-2">
                  (Cannot exceed 100%)
                </span>
              )}
            </div>
          </div>

          {message && (
            <div
              className={`p-4 mb-4 rounded ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {strategies.map((strategy, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Strategy {index + 1}</h3>
                  {strategies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStrategy(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sector
                    </label>
                    <select
                      value={strategy.sector}
                      onChange={(e) => handleChange(index, 'sector', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {Object.entries(Sector)
                        .filter(([key]) => isNaN(Number(key)))
                        .map(([key, value]) => (
                          <option key={value} value={value}>
                            {key}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Allocation Percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={strategy.nichePercentage || ''}
                      onChange={(e) => handleChange(index, 'nichePercentage', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleAddStrategy}
                className="px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50"
              >
                Add Another Strategy
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={isLoading || !isValid}
              >
                {isLoading ? "Saving..." : "Save Strategies"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
