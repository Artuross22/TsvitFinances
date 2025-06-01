'use client';

import React, { useState, useEffect } from 'react';
import { PositionType } from '@/types/strategy';
import { editPositionScalingManagerGet, editPositionScalingManagerPost } from '@/api/strategy';
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
    <div className="min-h-screen bg-gray-50">
       <div className="flex bg-gray-200 justify-center mt-2">
      <div className="absolute left-4 text-green-600 hover:text-green-700">
          <BackLink />
        </div>
        <strong>Position Management</strong>
      </div>
         
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">   
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Position Scaling Manager</h1>
              <p className="mt-1 text-sm text-gray-500">Configure your position scaling targets for optimal risk management</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={savePositionScaling}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>

          {!emptyState && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className={`px-4 py-2 rounded-lg ${
                  totals.longTotal > 100 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                } font-medium`}>
                  Long Total: {totals.longTotal.toFixed(1)}%
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  totals.shortTotal > 100 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                } font-medium`}>
                  Short Total: {totals.shortTotal.toFixed(1)}%
                </div>
                <div className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800 font-medium">
                  Long Positions: {counts.longCount}
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-100 text-purple-800 font-medium">
                  Short Positions: {counts.shortCount}
                </div>
              </div>
            </div>
          )}

          {validationError && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-700 font-medium">{validationError}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {emptyState ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="mt-4 text-gray-500">No positions added yet. Click one of the buttons below to add a position.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {/* Short Positions Column */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-purple-700 mb-2">Short Positions</h3>
                  {positionManagement?.positionScalings
                    ?.filter(scaling => scaling.positionType === PositionType.Short)
                    .map((scaling, index) => (
                      <div
                        key={scaling.publicId}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Position {index + 1}
                          </span>
                          <button
                            onClick={() => removePositionScaling(
                              positionManagement.positionScalings?.findIndex(s => s.publicId === scaling.publicId) ?? -1
                            )}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Equity Percentage
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={scaling.equityPercentage}
                                onChange={(e) => updatePositionScaling(
                                  positionManagement.positionScalings?.findIndex(s => s.publicId === scaling.publicId) ?? -1,
                                  { equityPercentage: e.target.value }
                                )}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                placeholder="Minimum 0.01"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <span className="text-gray-500 text-sm">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Long Positions Column */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">Long Positions</h3>
                  {positionManagement?.positionScalings
                    ?.filter(scaling => scaling.positionType === PositionType.Long)
                    .map((scaling, index) => (
                      <div
                        key={scaling.publicId}
                        className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Position {index + 1}
                          </span>
                          <button
                            onClick={() => removePositionScaling(
                              positionManagement.positionScalings?.findIndex(s => s.publicId === scaling.publicId) ?? -1
                            )}
                            className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded-lg"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Equity Percentage
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={scaling.equityPercentage}
                                onChange={(e) => updatePositionScaling(
                                  positionManagement.positionScalings?.findIndex(s => s.publicId === scaling.publicId) ?? -1,
                                  { equityPercentage: e.target.value }
                                )}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                placeholder="Minimum 0.01"
                              />
                              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                <span className="text-gray-500 text-sm">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              onClick={() => addPosition(PositionType.Short)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Sell Target
            </button>
            <button
              onClick={() => addPosition(PositionType.Long)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Buy Target
            </button>
          </div>
        </div>
      </div>
    </div> 
  );
};

export default PositionScalingManager;