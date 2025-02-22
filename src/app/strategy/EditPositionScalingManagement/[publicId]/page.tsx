'use client';

import React, { useState, useEffect } from 'react';
import { PositionType } from '@/types/strategy';
import { editPositionScalingManagerGet, editPositionScalingManagerPost } from '@/utils/strategy';
import BackLink from '@/features/components/useful/BackLink';

interface PositionScalings {
  publicId: string;
  equityPercentage: string;
  positionType: PositionType;
}

export interface GetPositionScaling {
  publicId: string;
  positionScalings?: PositionScalings[];
}

interface Props {
  params: {
    publicId: string;
  };
}

const PositionScalingManager: React.FC<Props> = ({ params }) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionManagement, setPositionManagement] = useState<GetPositionScaling | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setIsLoading(true);
        const model = await editPositionScalingManagerGet(params.publicId);
        setPositionManagement(model);
      } catch (err) {
        setError("Failed to load position data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [params.publicId]);

  const savePositionScaling = async () => {
    if (!positionManagement) return;

    const hasInvalidValues = positionManagement.positionScalings?.some(scaling => {
      const value = parseFloat(scaling.equityPercentage);
      return isNaN(value) || value < 0.01;
    });

    if (hasInvalidValues) {
      setValidationError("All equity percentages must be at least 0.01%");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await editPositionScalingManagerPost(positionManagement);
      if (!success) {
        setError("Failed to save position scaling");
      }
    } catch (err) {
      setError("Failed to save position scaling");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalsByType = (scalings: PositionScalings[]) => {
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

  const countPositionsByType = (scalings: PositionScalings[]) => {
    return scalings.reduce(
      (acc, scaling) => {
        if (scaling.positionType === PositionType.Long) {
          acc.longCount++;
        } else {
          acc.shortCount++;
        }
        return acc;
      },
      { longCount: 0, shortCount: 0 }
    );
  };

  const validatePositionTotals = (scalings: PositionScalings[]): boolean => {
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

  const addPosition = (positionType: PositionType) => {
    if (!positionManagement) return;

    const newScaling: PositionScalings = {
      publicId: crypto.randomUUID(),
      equityPercentage: '',
      positionType: positionType,
    };

    const newScalings = [...(positionManagement.positionScalings || []), newScaling];
    
    if (validatePositionTotals(newScalings)) {
      setPositionManagement({
        ...positionManagement,
        positionScalings: newScalings,
      });
    }
  };

  const updatePositionScaling = (index: number, updates: Partial<PositionScalings>) => {
    if (!positionManagement?.positionScalings) return;

    const updatedScalings = [...positionManagement.positionScalings];
    
    if (updates.equityPercentage !== undefined) {
      if (updates.equityPercentage === '' || 
          updates.equityPercentage === '0.' || 
          /^\d*\.?\d*$/.test(updates.equityPercentage)) {
        updatedScalings[index] = { ...updatedScalings[index], ...updates };
      }
    } else {
      updatedScalings[index] = { ...updatedScalings[index], ...updates };
    }

    if (validatePositionTotals(updatedScalings)) {
      setPositionManagement({
        ...positionManagement,
        positionScalings: updatedScalings,
      });
    }
  };

  const removePositionScaling = (index: number) => {
    if (!positionManagement?.positionScalings) return;

    const updatedScalings = positionManagement.positionScalings.filter((_, i) => i !== index);
    
    if (validatePositionTotals(updatedScalings)) {
      setPositionManagement({
        ...positionManagement,
        positionScalings: updatedScalings,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-red-800 font-medium text-lg">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const emptyState = !positionManagement?.positionScalings?.length;
  const totals = positionManagement?.positionScalings ? 
    calculateTotalsByType(positionManagement.positionScalings) : 
    { longTotal: 0, shortTotal: 0 };
  const counts = positionManagement?.positionScalings ?
    countPositionsByType(positionManagement.positionScalings) :
    { longCount: 0, shortCount: 0 };

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <div className="absolute left-4 text-green-600 hover:text-green-700">
          <BackLink />
        </div>
        <h2 className="text-center flex-grow">
          <strong>Position Scaling Management</strong>
        </h2>
      </div>
         
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 max-w-5xl mx-auto px-4 py-8">   
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Position Scaling Manager</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={savePositionScaling}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        {!emptyState && (
          <div className="bg-white rounded-lg p-4 mb-8 flex justify-between items-center shadow-sm">
            <div className="space-x-6 flex">
              <div className={`px-4 py-2 rounded-full ${
                totals.longTotal > 100 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                Long Total: {totals.longTotal.toFixed(1)}%
              </div>
              <div className={`px-4 py-2 rounded-full ${
                totals.shortTotal > 100 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                Short Total: {totals.shortTotal.toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {validationError && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <p className="text-yellow-700">{validationError}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {emptyState ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No positions added yet. Click one of the buttons below to add a position.</p>
            </div>
          ) : (
            positionManagement?.positionScalings?.map((scaling, index) => (
              <div
                key={scaling.publicId}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-md font-medium text-gray-900">
                    Position {index + 1}
                  </span>
                  <button
                    onClick={() => removePositionScaling(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equity Percentage
                    </label>
                    <input
                      type="text"
                      value={scaling.equityPercentage}
                      onChange={(e) => updatePositionScaling(index, { equityPercentage: e.target.value })}
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Minimum 0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Type
                    </label>
                    <select
                      value={scaling.positionType}
                      onChange={(e) => updatePositionScaling(index, { 
                        positionType: parseInt(e.target.value) as PositionType 
                      })}
                      className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value={PositionType.Long}>Long</option>
                      <option value={PositionType.Short}>Short</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => addPosition(PositionType.Long)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add buy target
          </button>
          <button
            onClick={() => addPosition(PositionType.Short)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Add sell target
          </button>
        </div>
      </div>
    </div> 
  );
};

export default PositionScalingManager;