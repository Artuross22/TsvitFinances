"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  editPositionManagementGet,
  editPositionManagementPost,
} from "@/utils/strategy";
import { PositionType } from "@/types/strategy";

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
  scalingIn: number | null;
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
    
    setValidationError(null);
    return true;
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

    // Validate before updating
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

    // Revalidate after removal
    validatePositionTotals(updatedScalings);
  };

  const renderScalingsList = () => {
    if (!positionManagement?.positionScalings?.length) {
      return (
        <div className="text-gray-500 italic text-center p-4">
          No position scalings available
        </div>
      );
    }

    const { longTotal, shortTotal } = calculateTotalsByType(positionManagement.positionScalings);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Position Scalings</h3>
          <div className="flex space-x-4 text-sm">
            <span className={`px-3 py-1 rounded-full ${
              longTotal > 100 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              Long Total: {longTotal.toFixed(1)}%
            </span>
            <span className={`px-3 py-1 rounded-full ${
              shortTotal > 100 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
            }`}>
              Short Total: {shortTotal.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {positionManagement.positionScalings.map((scaling, index) => (
            <div
              key={scaling.publicId}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center space-x-6">
                <span className="font-medium text-gray-700">
                  Position {index + 1}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Equity:</span>
                  <span className="font-semibold">{scaling.equityPercentage}%</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    scaling.positionType === PositionType.Long
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {PositionType[scaling.positionType]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
      <div className="flex bg-gray-200 justify-center mt-2 p-4 relative">
        <Link
          href={`/strategy/View/${positionManagement.strategyPublicId}`}
          className="absolute left-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          Back
        </Link>
        <h2 className="text-xl font-bold">Position Management</h2>
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

        {renderScalingsList()}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <input type="hidden" name="id" value={positionManagement.publicId} />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Scaling In
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
              Scaling Out
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
              Average Level
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
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Position Scalings
              </label>
              <button
                type="button"
                onClick={addPositionScaling}
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <span>Add Position</span>
              </button>
            </div>

            {positionManagement.positionScalings?.map((scaling, index) => (
              <div key={scaling.publicId} className="p-4 border rounded-md space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-700">Position {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removePositionScaling(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Equity Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={scaling.equityPercentage}
                      onChange={(e) =>
                        updatePositionScaling(index, {
                          equityPercentage: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position Type
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={scaling.positionType}
                      onChange={(e) =>
                        updatePositionScaling(index, {
                          positionType: parseInt(e.target.value) as PositionType,
                        })
                      }
                      required
                    >
                      <option value={PositionType.Long}>Long</option>
                      <option value={PositionType.Short}>Short</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
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