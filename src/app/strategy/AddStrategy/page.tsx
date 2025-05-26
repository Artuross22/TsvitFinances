"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createStrategy } from "@/api/strategy";
import Link from "next/link";

export type AddStragy = {
  id: number;
  publicId: string;
  userPublicId: string;
  name: string;
  description: string;
};

const initialStragy: Partial<AddStragy> = {};

export default function AddStrategy() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<AddStragy>>(initialStragy);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await createStrategy(formData);
      setMessage("Strategy created successfully!");
      router.push("/strategy");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href={`/strategy`} className="absolute left-1 text-green">
          Back
        </Link>
        <h2>
          <strong>Create Strategies</strong>
        </h2>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Add New Strategy</h1>
          {message && (
            <div
              className={`p-4 mb-4 rounded ${
                message.includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Strategy Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Strategy"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
