"use client";

import { addChart } from "@/utils/asset";
import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { _addChart } from "@/types/assetsDto";

interface AssetProps {
  params: { id: string; name: string };
}

const AddPositionEntryChart: React.FC<AssetProps> = ({ params }) => {
  const [charts, setCharts] = useState<_addChart[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      const newCharts = files.map((file) => ({
        name: file.name,
        description: "",
        file,
      }));
      setCharts((prevCharts) => [...prevCharts, ...newCharts]);

      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [],
  );

  const showNotification = useCallback(
    (message: string, type: "success" | "error") => {
      setNotification({ show: true, message, type });
      setTimeout(
        () => setNotification((prev) => ({ ...prev, show: false })),
        3000,
      );
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("assetId", params.id);
        charts.forEach((chart, index) => {
          formData.append(`charts[${index}].name`, chart.name);
          formData.append(
            `charts[${index}].description`,
            chart.description || "",
          );
          formData.append(`charts[${index}].file`, chart.file);
        });

        await addChart(formData);
        showNotification("Charts uploaded successfully", "success");
        setCharts([]);
      } catch (error) {
        console.error("Error uploading charts:", error);
        showNotification("Failed to upload charts. Please try again.", "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [charts, params.id, showNotification],
  );

  const removeFile = useCallback((index: number) => {
    setCharts((prevCharts) => prevCharts.filter((_, i) => i !== index));
  }, []);

  const updateDescription = useCallback(
    (index: number, description: string) => {
      setCharts((prevCharts) => {
        const updatedCharts = [...prevCharts];
        updatedCharts[index] = { ...updatedCharts[index], description };
        return updatedCharts;
      });
    },
    [],
  );

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <Link
          href={`/investing/ViewAsset/${params.id}`}
          className="mr-auto text-green"
        >
          Back
        </Link>
        <h2 className="text-center flex-grow">
          <strong>{params.name}</strong>
        </h2>
      </div>

      <div className="container mx-auto px-4 py-8">
        {notification.show && (
          <div
            className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6"
        >
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Upload Charts
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-2 gap-4 mt-6">
              {charts.map((chart, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg p-2 bg-gray-50"
                >
                  <img
                    src={URL.createObjectURL(chart.file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                  <input
                    type="text"
                    placeholder="Add description"
                    value={chart.description}
                    onChange={(e) => updateDescription(index, e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!charts.length || isSubmitting}
            className={`w-full px-4 py-2 rounded-md text-white transition-colors ${
              !charts.length || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Uploading..." : "Create Asset"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPositionEntryChart;
