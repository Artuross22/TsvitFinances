"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { editEditRiskManagementGet, editRiskManagementPost } from "@/utils/strategy";
import { RiskCategory } from "@/types/strategy";

export interface EditRiskManagement {
  id: number;
  publicId: string;
  name: string;
  category: RiskCategory;
  baseRiskPercentage: number;
  riskToRewardRatio: number;
  hedgeId: number;
  hedge: Hedge | null;
  strategyPublicId: string;
}

interface RiskManagementFormProps {
  params: {
    publicId: string;
  };
}

type Hedge = {
  name: string;
};

const RiskManagementForm = ({ params }: RiskManagementFormProps) => {
  const [riskManagement, setRiskManagement] = useState<EditRiskManagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRiskManagement = async () => {
      try {
        setIsLoading(true);
        const data = await editEditRiskManagementGet(params.publicId);
        setRiskManagement(data);
      } catch (err) {
        setError("Failed to load risk management data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskManagement();
  }, [params.publicId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof EditRiskManagement
  ) => {
    if (!riskManagement) return;

    if (field === 'category') {
      setRiskManagement({
        ...riskManagement,
        [field]: parseInt(e.target.value),
      });
    } else {
      setRiskManagement({
        ...riskManagement,
        [field]: parseFloat(e.target.value) || 0,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskManagement) return;

    try {
      setIsSaving(true);
      setError(null);

      const submissionData = {
        ...riskManagement,
        publicId: params.publicId,
      };

      await editRiskManagementPost(submissionData);
    } catch (err) {
      setError("Failed to update risk management settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!riskManagement) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Failed to load risk management data
      </div>
    );
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href={`/strategy/View/${riskManagement.strategyPublicId}`} className="absolute left-1 text-green">
          Back
        </Link>
        <h2>
          <strong>Create Strategies</strong>
        </h2>
      </div>
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={riskManagement.publicId} />

            <div className="space-y-2">
              <label htmlFor="baseRiskPercentage" className="block text-sm font-medium text-gray-700">
                Base Risk Percentage
              </label>
              <input
                id="baseRiskPercentage"
                type="number"
                step="0.01"
                value={riskManagement.baseRiskPercentage || ""}
                onChange={(e) => handleInputChange(e, "baseRiskPercentage")}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="riskToRewardRatio" className="block text-sm font-medium text-gray-700">
                Risk to Reward Ratio
              </label>
              <input
                id="riskToRewardRatio"
                type="number"
                step="0.01"
                value={riskManagement.riskToRewardRatio || ""}
                onChange={(e) => handleInputChange(e, "riskToRewardRatio")}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Risk Category
              </label>
              <select
                id="category"
                value={riskManagement.category}
                onChange={(e) => handleInputChange(e, "category")}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={RiskCategory.Low}>Low</option>
                <option value={RiskCategory.Medium}>Medium</option>
                <option value={RiskCategory.MediumHigh}>Medium High</option>
                <option value={RiskCategory.High}>High</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full px-4 py-2 text-white rounded-md transition-colors ${
                isSaving
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Updating...
                </span>
              ) : (
                "Update Risk Management"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementForm;