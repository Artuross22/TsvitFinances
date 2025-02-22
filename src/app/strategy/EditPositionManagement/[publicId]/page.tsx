"use client";

import React, { useEffect, useState } from "react";
import {
  editPositionManagementGet,
  editPositionManagementPost,
} from "@/utils/strategy";
import BackLink from "@/features/components/useful/BackLink";

interface Props {
  params: {
    publicId: string;
  };
}

export type EditPositionManagement = {
  publicId: string;
  strategyPublicId: string;
  averageLevel: number;
};

const PositionManagement: React.FC<Props> = ({ params }) => {
  const [positionManagement, setPositionManagement] =
    useState<EditPositionManagement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!positionManagement) return;
  
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
      <div className="absolute left-4 text-green-600 hover:text-green-700">
          <BackLink />
        </div>
        <strong>Position Management</strong>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}   
    
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <input type="hidden" name="id" value={positionManagement.publicId} />

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
        
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-2 text-white rounded-md transition-colors bg-blue-500 hover:bg-blue-600">
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