"use client";

import React, { useState } from 'react';
import { PositionType } from '@/types/strategy';
import { PositionScaling } from '@/app/strategy/EditPositionManagement/[publicId]/page';

interface PositionScalingManagerProps {
  positionScalings: PositionScaling[];
  onUpdate: (index: number, updates: Partial<PositionScaling>) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  validationError: string | null;
}

export const PositionScalingManager: React.FC<PositionScalingManagerProps> = ({
  positionScalings,
  onUpdate,
  onRemove,
  onAdd,
  validationError,
}) => {
  const [showZeroError, setShowZeroError] = useState(false);

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

  const handleAdd = () => {
    const hasZeroEquity = positionScalings.some(
      scaling => parseFloat(scaling.equityPercentage) === 0
    );
    
    if (hasZeroEquity) {
      setShowZeroError(true);
      setTimeout(() => setShowZeroError(false), 3000);
    } else {
      setShowZeroError(false);
      onAdd();
    }
  };

  const handleUpdate = (index: number, updates: Partial<PositionScaling>) => {
    if (updates.equityPercentage !== undefined) {
      const value = parseFloat(updates.equityPercentage);
      if (value === 0) {
        return;
      }
    }
    onUpdate(index, updates);
  };

  const { longTotal, shortTotal } = calculateTotalsByType(positionScalings);

  if (!positionScalings?.length) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Position Scalings
          </label>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>Add Position</span>
          </button>
        </div>
        <div className="text-gray-500 italic text-center p-4">
          No position scalings available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          {positionScalings.map((scaling, index) => (
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Position Scalings
          </label>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <span>Add Position</span>
          </button>
        </div>

        {showZeroError && (
          <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded relative">
            Cannot add new position while existing positions have 0% equity
          </div>
        )}

        {validationError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            {validationError}
          </div>
        )}

        {positionScalings.map((scaling, index) => (
          <div key={scaling.publicId} className="p-4 border rounded-md space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Position {index + 1}</h4>
              <button
                type="button"
                onClick={() => onRemove(index)}
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
                  min="0.01"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={scaling.equityPercentage}
                  onChange={(e) =>
                    handleUpdate(index, {
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
                    handleUpdate(index, {
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
    </div>
  );
};

export default PositionScalingManager;