"use client";

import React, { useEffect, useState } from "react";
import {
  getCharts,
  updateChart,
  deleteCharts,
  updateNote,
  deletePositionEntry,
} from "@/utils/asset";
import Image from "next/image";
import Link from "next/link";
import BackLink from "@/features/components/useful/BackLink";
import DescriptionTooltip from "@/features/tools/DescriptionTooltip";

interface AssetProps {
  params: {
    id: string;
    name: string;
  };
}

export interface UpdateChart {
  id: number;
  assetId: string;
  name: string;
  description: string;
  positionEntryId: string;
}

export interface UpdateNote {
  id: string;
  note: string;
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

const ListPositionEntry: React.FC<AssetProps> = ({ params }) => {
  const [asset, setFormAsset] = useState<PositionEntryModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingChart, setEditingChart] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name?: string;
    description?: string;
    note?: string;
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

  const showSuccessMessage = (message: string) => {
    const successMessage = document.getElementById("successMessage");
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.classList.remove("hidden");
      setTimeout(() => {
        successMessage.classList.add("hidden");
      }, 3000);
    }
  };

  const handleEditNote = (note: string, positionId: string) => {
    setEditingNote(positionId);
    setEditForm({
      note: note,
    });
    setError(null);
  };

  const handleSaveNote = async (positionId: string) => {
    if (!editForm?.note || !asset) return;

    setSaving(true);
    setError(null);

    try {
      const saveNoteModel: UpdateNote = {
        id: positionId,
        note: editForm.note,
      };

      await updateNote(saveNoteModel);

      const updatedAsset = {
        ...asset,
        positionEntries: asset.positionEntries?.map((position) =>
          position.publicId === positionId
            ? { ...position, note: editForm.note }
            : position,
        ),
      };

      setFormAsset(updatedAsset);
      showSuccessMessage("Note updated successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      setError(error instanceof Error ? error.message : "Failed to save note");
    } finally {
      setSaving(false);
      setEditingNote(null);
      setEditForm(null);
    }
  };

  const handleDeleteNote = async (positionId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setDeleting(positionId);
    setError(null);

    try {
      await deletePositionEntry(positionId);

      const updatedAsset = {
        ...asset!,
        positionEntries: asset!.positionEntries?.filter(
          (position) => position.publicId !== positionId,
        ),
      };

      setFormAsset(updatedAsset);
      showSuccessMessage("Note deleted successfully!");
    } catch (error) {
      console.error("Error deleting note:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete note",
      );
    } finally {
      setDeleting(null);
    }
  };

  // Chart handlers
  const handleEdit = (chart: _Chart) => {
    setEditingChart(chart.id.toString());
    setEditForm({
      name: chart.name,
      description: chart.description || "",
    });
    setError(null);
  };

  const handleSave = async (chart: _Chart, positionEntryId: string) => {
    if (!editForm || !asset) return;

    setSaving(true);
    setError(null);

    try {
      const saveChartModel: UpdateChart = {
        id: chart.id,
        assetId: params.id,
        name: editForm.name!,
        description: editForm.description || "",
        positionEntryId,
      };

      await updateChart(saveChartModel);

      const updatedAsset = {
        ...asset,
        positionEntries: asset.positionEntries?.map((position) => ({
          ...position,
          charts: position.charts?.map((c) =>
            c.id === chart.id ? { ...c, ...editForm } : c,
          ),
        })),
      };

      setFormAsset(updatedAsset);
      showSuccessMessage("Chart updated successfully!");
    } catch (error) {
      console.error("Error saving chart:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save changes",
      );
    } finally {
      setSaving(false);
      setEditingChart(null);
      setEditForm(null);
    }
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
      showSuccessMessage("Chart deleted successfully!");
    } catch (error) {
      console.error("Error deleting chart:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete chart",
      );
    } finally {
      setDeleting(null);
    }
  };

  const handleCancel = () => {
    setEditingChart(null);
    setEditingNote(null);
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
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <div className="absolute left-4 text-green-600 hover:text-green-700">
          <BackLink />
        </div>

        <h2 className="font-bold">{params.name}</h2>
        <Link
          href={`/PositionEntryNotes/AddCharts/${params.id}/${params.name}`}
          className="absolute right-4 text-green-600 hover:text-green-700"
        >
          Add
        </Link>
      </div>

      <div className="container mx-auto p-4">
        <div
          id="successMessage"
          className="hidden fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
        />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {asset.positionEntries?.map((position) => (
          <div key={position.publicId} className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Note Card */}
              {position.note && (
                <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                  <div className="p-4">
                    {editingNote === position.publicId ? (
                      <div className="space-y-4">
                        <textarea
                          value={editForm?.note || ""}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev!,
                              note: e.target.value,
                            }))
                          }
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                          placeholder="Note content"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNote(position.publicId)}
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
                          <h2 className="text-lg font-semibold">Notes</h2>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleEditNote(
                                  position.note!,
                                  position.publicId,
                                )
                              }
                              className="p-2 hover:bg-gray-100 rounded transition duration-150"
                              title="Edit"
                              aria-label="Edit Note"
                            >
                              ✏️
                            </button>

                            <Link
                              href={`/PositionEntryNotes/AddChartToPositionEntry/${position.publicId}`}
                              className="px-1 py-2"
                              aria-label="Add Charts"
                              role="button"
                            >
                              ➕
                            </Link>

                            <button
                              onClick={() =>
                                handleDeleteNote(position.publicId)
                              }
                              disabled={deleting === position.publicId}
                              className={`p-2 rounded text-red-600 transition duration-150 ${
                                deleting === position.publicId
                                  ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                                  : "hover:bg-red-100"
                              }`}
                              title="Delete"
                              aria-label="Delete Note"
                            >
                              {deleting === position.publicId ? "⏳" : "🗑️"}
                            </button>
                          </div>
                        </div>
                        <div className="relative h-48 w-full bg-gray-50 rounded overflow-y-auto">
                          <div className="p-4">
                            <p className="text-gray-600 whitespace-pre-wrap break-words">
                              {position.note}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Charts */}
              {position.charts?.map((chart) => (
                <div
                  key={chart.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
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
                          <h2 className="text-lg font-semibold">
                            {chart.name}
                          </h2>
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
                                handleDelete(
                                  chart.id.toString(),
                                  asset.assetPublicId,
                                )
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
                        <DescriptionTooltip description={chart.description} />
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
export default ListPositionEntry;
