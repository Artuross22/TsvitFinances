"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDiversifications, updateDiversification } from "@/utils/strategy";

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

export type EditDiversification = {
  publicId: string;
  diversifications: Diversification[];
};

export type Diversification = {
  id: number;
  nichePercentage: number;
  sector: Sector;
};

interface Props {
  params: {
    publicId: string;
  };
}

export default function DiversificationPage({ params }: Props) {
  const router = useRouter();
  const [diversifications, setDiversifications] = useState<Diversification[]>([]);
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiversifications = async () => {
      try {
        const data = await getDiversifications(params.publicId);
        setDiversifications(data.diversifications);
        calculateTotalPercentage(data.diversifications);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load diversifications");
        setIsLoading(false);
      }
    };

    fetchDiversifications();
  }, [params.publicId]);

  const calculateTotalPercentage = (divs: Diversification[]) => {
    const total = divs.reduce((sum, div) => sum + div.nichePercentage, 0);
    setTotalPercentage(total);
  };

  const handlePercentageChange = (index: number, value: number) => {
    const updatedDiversifications = [...diversifications];
    updatedDiversifications[index].nichePercentage = value;
    setDiversifications(updatedDiversifications);
    calculateTotalPercentage(updatedDiversifications);
  };

  const handleSectorChange = (index: number, sector: Sector) => {
    const updatedDiversifications = [...diversifications];
    updatedDiversifications[index].sector = sector;
    setDiversifications(updatedDiversifications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (totalPercentage !== 100) {
      setError("Total percentage must equal 100%");
      return;
    }

    try {
      setIsLoading(true);
      await updateDiversification({
        publicId: params.publicId,
        diversifications: diversifications
      });
      router.push(`/strategy/${params.publicId}`);
    } catch (err) {
      setError("Failed to update diversifications");
      setIsLoading(false);
    }
  };

  const addNewDiversification = () => {
    setDiversifications([
      ...diversifications,
      {
        id: 0,
        nichePercentage: 0,
        sector: Sector.Technology
      }
    ]);
  };

  const removeDiversification = (index: number) => {
    const updatedDiversifications = diversifications.filter((_, i) => i !== index);
    setDiversifications(updatedDiversifications);
    calculateTotalPercentage(updatedDiversifications);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Diversification Strategy</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {diversifications.map((div, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded">
            <select
              value={div.sector}
              onChange={(e) => handleSectorChange(index, Number(e.target.value) as Sector)}
              className="p-2 border rounded"
            >
              {Object.entries(Sector)
                .filter(([key]) => isNaN(Number(key)))
                .map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
            </select>

            <input
              type="number"
              value={div.nichePercentage}
              onChange={(e) => handlePercentageChange(index, Number(e.target.value))}
              min="0"
              max="100"
              className="p-2 border rounded w-24"
            />
            <span>%</span>

            <button
              type="button"
              onClick={() => removeDiversification(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center py-4">
          <button
            type="button"
            onClick={addNewDiversification}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Sector
          </button>
          
          <div className="text-lg">
            Total: {totalPercentage}%
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href={`/strategy/${params.publicId}`}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </Link>
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}