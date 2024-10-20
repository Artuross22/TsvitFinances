'use client'

import React, { useEffect, useState } from "react";
import { getCharts, updateChart, deleteCharts } from "@/utils/asset";
import { ListCharts, _Chart, SaveChart } from "@/types/AssetsDto";
import Image from 'next/image';

interface AssetProps {
  params: {
    id: string;
  };
}

const AssetForm: React.FC<AssetProps> = ({ params }) => {
  const [asset, setFormAsset] = useState<ListCharts | null>(null);
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
      setError('Error loading assets');
      console.error('Error fetching asset:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chart: _Chart) => {
    setEditingChart(chart.id);
    setEditForm({
      name: chart.name,
      description: chart.description,
    });
    setError(null);
  };

  const handleDelete = async (chartId: string, assetId : string)  => {
    if (!confirm('Are you sure you want to delete this chart?')) {
      return;
    }

    setDeleting(chartId);
    setError(null);

    try {
      await deleteCharts(chartId, assetId);
      
      await fetchAsset(); 

      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.textContent = 'Chart deleted successfully';
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 3000);
      }

    } catch (error) {
      console.error('Error deleting chart:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete chart');
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async (chart: _Chart) => {
    if (!editForm || !asset) return;
    
    setSaving(true);
    setError(null);

    try {
      const saveChartModel: SaveChart = {
        id: chart.id,
        assetId: params.id,
        name: editForm.name,
        description: editForm.description,
      };

      await updateChart(saveChartModel);

      const updatedCharts = asset.charts.map(c => 
        c.id === chart.id 
          ? { ...c, ...editForm }
          : c
      );

      setFormAsset({ ...asset, charts: updatedCharts });

      const successMessage = document.getElementById('successMessage');
      if (successMessage) {
        successMessage.textContent = 'Changes saved successfully!';
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 3000);
      }

    } catch (error) {
      console.error('Error saving chart:', error);
      setError(error instanceof Error ? error.message : 'Failed to save changes');
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
    return (
      <div className="text-center p-4">
        No asset data available.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Asset Charts</h1>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {asset.charts.map((chart) => (
          <div 
            key={chart.id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              {editingChart === chart.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm?.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev!, name: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Chart name"
                  />
                  <textarea
                    value={editForm?.description || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev!, description: e.target.value }))}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Chart description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(chart)}
                      disabled={saving}
                      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                        ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Saving...' : 'Save'}
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
                        onClick={() => handleDelete(chart.id, asset.assetPublicId)}
                        disabled={deleting === chart.id}
                        className={`p-2 hover:bg-red-100 rounded text-red-600
                          ${deleting === chart.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Delete"
                      >
                        {deleting === chart.id ? '⏳' : '🗑️'}
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{chart.description}</p>
                </>
              )}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetForm;
