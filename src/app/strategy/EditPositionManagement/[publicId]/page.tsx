"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  editPositionManagementGet,
  editPositionManagementPost,
} from "@/utils/strategy";
import { PositionType } from "@/types/strategy";
import { PositionScalingManager } from "@/features/components/strategy/editPositionManagement/page";

interface Props {
  params: {
    publicId: string;
  };
}

export type EditPositionManagement = {
  id: number;
  publicId: string;
  strategyPublicId: string;
  scalingOut: number | null;
  scalingOutPositionDistribution : number | null;
  scalingIn: number | null;
  scalingInPositionDistribution : number | null;
  averageLevel: number;
  positionScalings: PositionScaling[] | null;
};

export type PositionScaling = {
  publicId: string;
  equityPercentage: string;
  positionType: PositionType;
};

const PositionManagement: React.FC<Props> = ({ params }) => {
  const [positionManagement, setPositionManagement] =
    useState<EditPositionManagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setIsLoading(true);
        const model = await editPositionManagementGet(params.publicId);
        setPositionManagement(model);
      } catch (err) {
        setError("Failed to load position data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [params.publicId]);

  const calculateTotalsByType = (scalings: PositionScaling[]) => {
    return scalings.reduce(
      (acc, scaling) => {
        const percentage = parseFloat(scaling.equityPercentage) || 0;
        if (scaling.positionType === PositionType.Long) {
          acc.longTotal += percentage;
        } else {
          acc.shortTotal += percentage;
        }
        return acc;
      },
      { longTotal: 0, shortTotal: 0 }
    );
  };

  const validatePositionTotals = (scalings: PositionScaling[]): boolean => {
    const { longTotal, shortTotal } = calculateTotalsByType(scalings);
    
    if (longTotal > 100) {
      setValidationError("Long positions total cannot exceed 100%");
      return false;
    }
    
    if (shortTotal > 100) {
      setValidationError("Short positions total cannot exceed 100%");
      return false;
    }
  
    const { longCount, shortCount } = countPositionsByType(scalings);
  
    if (positionManagement?.scalingInPositionDistribution && longCount > positionManagement.scalingInPositionDistribution) {
      setValidationError(`Number of long positions cannot exceed ${positionManagement.scalingInPositionDistribution}`);
      return false;
    }
  
    if (positionManagement?.scalingOutPositionDistribution && shortCount > positionManagement.scalingOutPositionDistribution) {
      setValidationError(`Number of short positions cannot exceed ${positionManagement.scalingOutPositionDistribution}`);
      return false;
    }
  
    setValidationError(null);
    return true;
  };
  
  const countPositionsByType = (scalings: PositionScaling[]): { longCount: number, shortCount: number } => {
    return scalings.reduce(
      (acc, scaling) => {
        if (scaling.positionType === PositionType.Long) {
          acc.longCount += 1;
        } else {
          acc.shortCount += 1;
        }
        return acc;
      },
      { longCount: 0, shortCount: 0 }
    );
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!positionManagement?.positionScalings) return;
  
    if (!validatePositionTotals(positionManagement.positionScalings)) {
      return;
    }
  
    try {
      setIsSaving(true);
      setError(null);
      await editPositionManagementPost(positionManagement);
    } catch (err) {
      setError("Failed to update position");
    } finally {
      setIsSaving(false);
    }
  };

  const addPositionScaling = () => {
    if (!positionManagement) return;

    const newScaling: PositionScaling = {
      publicId: crypto.randomUUID(),
      equityPercentage: "0",
      positionType: PositionType.Long,
    };

    const newScalings = [...(positionManagement.positionScalings || []), newScaling];
    
    setPositionManagement({
      ...positionManagement,
      positionScalings: newScalings,
    });
  };

  const updatePositionScaling = (index: number, updates: Partial<PositionScaling>) => {
    if (!positionManagement?.positionScalings) return;

    const updatedScalings = [...positionManagement.positionScalings];
    updatedScalings[index] = { ...updatedScalings[index], ...updates };

    if (updates.equityPercentage || updates.positionType) {
      validatePositionTotals(updatedScalings);
    }

    setPositionManagement({
      ...positionManagement,
      positionScalings: updatedScalings,
    });
  };

  const removePositionScaling = (index: number) => {
    if (!positionManagement?.positionScalings) return;

    const updatedScalings = positionManagement.positionScalings.filter((_, i) => i !== index);
    
    setPositionManagement({
      ...positionManagement,
      positionScalings: updatedScalings,
    });

    validatePositionTotals(updatedScalings);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!positionManagement) {
    return (
      <div className="text-center text-red-500">
        Failed to load position data
      </div>
    );
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link
          href={`/strategy/View/${positionManagement.strategyPublicId}`}
          className="absolute left-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          Back
        </Link>
        <strong>Position Management</strong>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {validationError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
            {validationError}
          </div>
        )}
    
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <input type="hidden" name="id" value={positionManagement.publicId} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Scaling In %
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter scaling in value"
              value={positionManagement.scalingIn || ""}
              onChange={(e) =>
                setPositionManagement({
                  ...positionManagement,
                  scalingIn: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Scaling Out %
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter scaling out value"
              value={positionManagement.scalingOut || ""}
              onChange={(e) =>
                setPositionManagement({
                  ...positionManagement,
                  scalingOut: parseFloat(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Average Level %
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter average level"
              value={positionManagement.averageLevel || ""}
              onChange={(e) =>
                setPositionManagement({
                  ...positionManagement,
                  averageLevel: parseFloat(e.target.value),
                })
              }
              required
            />

        <PositionScalingManager
          positionScalings={positionManagement.positionScalings || []}
          onUpdate={updatePositionScaling}
          onRemove={removePositionScaling}
          onAdd={addPositionScaling}
          validationError={validationError}   
        />
        
          </div>
          <button
            type="submit"
            disabled={isSaving || !!validationError}
            className={`w-full px-4 py-2 text-white rounded-md transition-colors ${
              isSaving || validationError
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
              "Update Position"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PositionManagement;