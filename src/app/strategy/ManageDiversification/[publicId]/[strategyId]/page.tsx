"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDiversifications, updateDiversification } from "@/api/strategy";
import BackLink from "@/features/components/useful/BackLink";

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
  diversifications: Diversification[] | null;
};

export type Diversification = {
  id: number;
  nichePercentage: number;
  minimumAssetsPerNiche: number;
  sector: Sector;
};

interface Props {
  params: {
    publicId: string;
    strategyId: string;
  };
}

export default function DiversificationPage({ params }: Props) {
  const router = useRouter();
  const [diversifications, setDiversifications] = useState<Diversification[]>(
    [],
  );
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiversifications = async () => {
      try {
        const data = await getDiversifications(params.publicId);
        setDiversifications(data.diversifications || []);
        calculateTotalPercentage(data.diversifications || []);
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

  const getAvailableSectors = (currentIndex: number) => {
    const usedSectors = diversifications
      .filter((_, index) => index !== currentIndex)
      .map((div) => div.sector);

    return Object.entries(Sector)
      .filter(([key]) => isNaN(Number(key)))
      .filter(([_, value]) => !usedSectors.includes(value as Sector));
  };

  const handlePercentageChange = (index: number, value: number) => {
    const updatedDiversifications = [...diversifications];
    const currentTotal =
      totalPercentage - updatedDiversifications[index].nichePercentage;

    if (currentTotal + value > 100) {
      setError("Total percentage cannot exceed 100%");
      return;
    }

    updatedDiversifications[index].nichePercentage = value;
    setDiversifications(updatedDiversifications);
    calculateTotalPercentage(updatedDiversifications);
    setError(null);
  };

  const handleSectorChange = (index: number, sector: Sector) => {
    const updatedDiversifications = [...diversifications];

    const sectorExists = diversifications.some(
      (div, i) => i !== index && div.sector === sector,
    );

    if (sectorExists) {
      setError("This sector is already selected");
      return;
    }

    updatedDiversifications[index].sector = sector;
    setDiversifications(updatedDiversifications);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalPercentage > 100) {
      setError("Total percentage cannot exceed 100%");
      return;
    }

    const sectors = diversifications.map((div) => div.sector);
    if (new Set(sectors).size !== sectors.length) {
      setError("Duplicate sectors are not allowed");
      return;
    }

    try {
      setIsLoading(true);
      await updateDiversification({
        publicId: params.publicId,
        diversifications: diversifications.length > 0 ? diversifications : null,
      });
      router.push(`/strategy/View/${params.strategyId}`);
    } catch (err) {
      setError("Failed to update diversifications");
      setIsLoading(false);
    }
  };

  const addNewDiversification = () => {
    if (totalPercentage >= 100) {
      setError("Cannot add more sectors - total percentage is already at 100%");
      return;
    }

    const availableSectors = getAvailableSectors(-1);
    if (availableSectors.length === 0) {
      setError("All sectors have been used");
      return;
    }

    setDiversifications([
      ...diversifications,
      {
        id: 0,
        nichePercentage: 0,
        minimumAssetsPerNiche: 1,
        sector: Number(availableSectors[0][1]) as Sector,
      },
    ]);
    setError(null);
  };

  const remove = (index: number) => {
    const updatedDiversifications = diversifications.filter(
      (_, i) => i !== index,
    );
    setDiversifications(updatedDiversifications);
    calculateTotalPercentage(updatedDiversifications);
    setError(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <BackLink />
        <div className="ml-auto flex space-x-12 text-green"></div>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">
          Edit Diversification Strategy
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {diversifications.map((div, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded"
            >
              <select
                value={div.sector}
                onChange={(e) =>
                  handleSectorChange(index, Number(e.target.value) as Sector)
                }
                className="p-2 border rounded"
              >
                {getAvailableSectors(index).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
                <option key={div.sector} value={div.sector}>
                  {Sector[div.sector]}
                </option>
              </select>

              <input
                type="number"
                value={div.nichePercentage || ""}
                onChange={(e) =>
                  handlePercentageChange(index, Number(e.target.value))
                }
                min="0"
                max={100 - (totalPercentage - div.nichePercentage)}
                className="p-2 border rounded w-24"
              />
              <span>%</span>

              <input
                type="number"
                value={div.minimumAssetsPerNiche || ""}
                onChange={(e) => {
                  const updatedDiversifications = [...diversifications];
                  updatedDiversifications[index].minimumAssetsPerNiche = Number(e.target.value);
                  setDiversifications(updatedDiversifications);
                }}
                min="1"
                className="p-2 border rounded w-24"
              />
              <span>min assets</span>

              <button
                type="button"
                onClick={() => remove(index)}
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
              disabled={
                totalPercentage >= 100 ||
                diversifications.length >= Object.keys(Sector).length / 2
              }
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
            >
              Add Sector
            </button>

            <div
              className={`text-lg ${totalPercentage > 100 ? "text-red-600" : ""}`}
            >
              Total: {totalPercentage}%
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={isLoading || totalPercentage > 100}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
