"use client";

import React, { useEffect, useState } from "react";
import { getCharts, updateChart, deleteCharts } from "@/utils/asset";
import Image from "next/image";
import Link from "next/link";
import { UpdateChart } from "@/types/assetsDto";

interface AssetProps {
  params: {
    id: string;
    name: string;
  };
}

export interface PositionEntryModel {
  assetPublicId: string;
  positionEntries?: PositionEntry[];
}

export interface PositionEntry {
  publicId: string;
  note?: string;
  charts?: _Chart[];
}

export interface _Chart {
  id: number;
  name: string;
  description?: string;
  chartsPath: string;
}

const AssetForm: React.FC<AssetProps> = ({ params }) => {
  const [asset, setFormAsset] = useState<PositionEntryModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingChart, setEditingChart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    fetchAsset();
  }, [params.id]);

  const fetchAsset = async () => {
    try {
      const asset = await getCharts(params.id);
      setFormAsset(asset);
    } catch (error) {
      setError("Error loading assets");
      console.error("Error fetching asset:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chart: _Chart) => {
    setEditingChart(chart.id.toString());
    setEditForm({
      name: chart.name,
      description: chart.description || "",
    });
    setError(null);
  };

  const handleDelete = async (chartId: string, assetId: string) => {
    if (!confirm("Are you sure you want to delete this chart?")) {
      return;
    }

    setDeleting(chartId);
    setError(null);

    try {
      await deleteCharts(chartId, assetId);
      await fetchAsset();

      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.textContent = "Chart deleted successfully";
        successMessage.classList.remove("hidden");
        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 3000);
      }
    } catch (error) {
      console.error("Error deleting chart:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete chart"
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async (chart: _Chart, positionEntryId: string) => {
    if (!editForm || !asset) return;

    setSaving(true);
    setError(null);

    try {
      const saveChartModel: UpdateChart = {
        id: chart.id,
        assetId: params.id,
        name: editForm.name,
        description: editForm.description,
        positionEntryId
      };

      await updateChart(saveChartModel);

      const updatedAsset = {
        ...asset,
        positionEntries: asset.positionEntries?.map(position => ({
          ...position,
          charts: position.charts?.map(c =>
            c.id === chart.id ? { ...c, ...editForm } : c
          )
        }))
      };

      setFormAsset(updatedAsset);

      const successMessage = document.getElementById("successMessage");
      if (successMessage) {
        successMessage.textContent = "Changes saved successfully!";
        successMessage.classList.remove("hidden");
        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving chart:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save changes"
      );
    } finally {
      setSaving(false);
      setEditingChart(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingChart(null);
    setEditForm(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin border-4 border-blue-500 rounded-full w-12 h-12 border-t-transparent"></div>
      </div>
    );
  }

  if (!asset) {
    return <div className="text-center p-4">No asset data available.</div>;
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link
          href={`/investing/ViewAsset/${params.id}`}
          className="absolute left-1 text-green"
        >
          Back
        </Link>
        <Link
          href={`/investing/Chart/AddCharts/${params.id}/${params.name}`}
          className="absolute right-1 text-green"
        >
          Add
        </Link>
        <h2>
          <strong>{params.name}</strong>
        </h2>
      </div>

      <div className="container mx-auto p-4">
        <div
          id="successMessage"
          className="hidden fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
        >
          Changes saved successfully!
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {asset.positionEntries?.map((position) => (
          <div key={position.publicId} className="mb-8">
            {position.note && (
              <div className="mb-6 overflow-x-auto">
                <div className="flex gap-6 min-w-0 pb-4">
                  {position.note.split('\n\n').map((noteSection, index) => (
                    noteSection.trim() && (
                      <div 
                        key={index}
                        className="border rounded-lg shadow-sm hover:shadow-md transition-shadow flex-none w-full md:w-1/2 lg:w-1/3"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">Note {index + 1}</h2>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg h-48 overflow-y-auto">
                            <p className="text-gray-600 whitespace-pre-wrap break-words">
                              {noteSection.trim()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )).filter(Boolean).slice(0, 3)}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {position.charts?.map((chart) => (
                <div
                  key={chart.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    {editingChart === chart.id.toString() ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={editForm?.name || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev!,
                              name: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Chart name"
                        />
                        <textarea
                          value={editForm?.description || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev!,
                              description: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Chart description"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(chart, position.publicId)}
                            disabled={saving}
                            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                            ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-lg font-semibold">{chart.name}</h2>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(chart)}
                              className="p-2 hover:bg-gray-100 rounded"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(chart.id.toString(), asset.assetPublicId)
                              }
                              disabled={deleting === chart.id.toString()}
                              className={`p-2 hover:bg-red-100 rounded text-red-600
                              ${deleting === chart.id.toString() ? "opacity-50 cursor-not-allowed" : ""}`}
                              title="Delete"
                            >
                              {deleting === chart.id.toString() ? "⏳" : "🗑️"}
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">{chart.description}</p>
                        <div className="relative h-48 w-full">
                          <a
                            href={chart.chartsPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Image
                              src={chart.chartsPath}
                              alt={chart.name}
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={false}
                            />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetForm;