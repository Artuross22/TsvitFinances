"use client";

import { useEffect, useState } from "react";
import { editTargetGet, editTargetPost } from "@/utils/asset";
import BackLink from "@/features/components/useful/BackLink";

export interface EditTarget {
  publicId: string;
  description?: string | null;
  level: number;
  averageLevel: number | null;
  levelName : string;
}

interface Props {
  params: {
    publicId: string;
    name: string;
  };
}

export default function EditTarget({ params }: Props) {
  const [target, setTarget] = useState<EditTarget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null; message: string }>({ type: null, message: '' });

useEffect(() => {
  const fetchTarget = async () => {
    try {
      const data = await editTargetGet(params.publicId, params.name);
      setTarget(data);
    } catch {
      setStatus({ type: 'error', message: 'Failed to load target' });
    } finally {
      setIsLoading(false);
    }
  };

  fetchTarget();
}, [params.publicId, params.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTarget(prev => prev && {
      ...prev,
      [name]: name === 'description' ? value : Number(value) || null
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    try {
      target.publicId = params.publicId;
      target.levelName = params.name;
      await editTargetPost(target);
      setStatus({ type: 'success', message: 'Target updated successfully!' });
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    } catch {
      setStatus({ type: 'error', message: 'Failed to update target' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
 <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <BackLink />
        <div className="ml-auto flex space-x-12 text-green"></div>
    </div>
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Target</h1>
      
      {status.type && (
        <div className={`mb-6 p-4 rounded-lg ${
          status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {status.message}
        </div>
      )}
      
      {target && (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={target.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <input
              id="level"
              name="level"
              type="number"
              value={target.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="averageLevel" className="block text-sm font-medium text-gray-700">
              Average Level
            </label>
            <input
              id="averageLevel"
              name="averageLevel"
              type="number"
              value={target.averageLevel || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
    </>
  );
}