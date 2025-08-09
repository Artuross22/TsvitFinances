"use client";

import { addAssetHistory } from "@/api/asset";
import { AddAssetHistory } from "@/types/asset";
import { PositionType } from "@/types/enums";
import { useState } from "react";

interface PageProps {
  assetId: string;
}

export const AddAssetHistoryPage = ({ assetId }: PageProps) => {
  const [formData, setFormData] = useState<Partial<AddAssetHistory>>({
    quantity: undefined,
    price: undefined,
    type: PositionType.Long,
    assetId: assetId,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "quantity" || name === "price") {
        if (value === "") {
          return { ...prev, [name]: undefined };
        }
        return { ...prev, [name]: parseFloat(value) };
      }
      if (name === "type") {
        return { ...prev, type: value ? (parseInt(value, 10) as PositionType) : undefined };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      if (!formData.quantity || !formData.price || !formData.type || !formData.assetId) {
        setMessage("Please fill in all required fields");
        return;
      }

      const assetHistoryData: AddAssetHistory = {
        quantity: formData.quantity,
        price: formData.price,
        type: formData.type!,
        assetId: formData.assetId,
      };

      await addAssetHistory(assetHistoryData);
      setMessage("Asset history added successfully!");
      
      setFormData({
        quantity: undefined,
        price: undefined,
        type: PositionType.Long,
        assetId: assetId,
      });
    } catch (error) {
      console.error("Error adding asset history:", error);
      setMessage("Failed to add asset history. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Asset History</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes("successfully") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity ?? ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quantity"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price ?? ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select type</option>
            <option value={PositionType.Long}>Buy</option>
            <option value={PositionType.Short}>Sell</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Adding..." : "Add Asset History"}
        </button>
      </form>
    </div>
  );
};

export default AddAssetHistoryPage;