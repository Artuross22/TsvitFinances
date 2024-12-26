"use client";

import BackLink from '@/features/components/useful/BackLink';
import { addTargets } from '@/utils/asset';
import { useState } from 'react';
import { useRouter } from "next/navigation";

export interface SalesLevels {
  description?: string | null;
  level: number;
  averageLevel: number | null;
}

export interface BuyLevels {
  description?: string | null;
  level: number;
  averageLevel: number | null;
}

export interface AddTarget {
  publicId : string;
  BuyLevels: BuyLevels[];
  SalesLevels: SalesLevels[];
}

interface Props {
  params: {
    publicId: string;
    assetPublicId: string;
  };
}

export default function AddTarget({ params }: Props) {
  const [targets, setTargets] = useState<AddTarget>({
      publicId : params.publicId,
      BuyLevels: [{
      description: '',
      averageLevel: null
    } as BuyLevels],
    SalesLevels: [{
      description: '',
      averageLevel: null
    } as SalesLevels]
  });

  const router = useRouter();

  const addBuyLevel = (): void => {
    setTargets(prev => ({
      ...prev,
      BuyLevels: [...prev.BuyLevels, { description: '', averageLevel: null } as BuyLevels]
    }));
  };

  const addSalesLevel = (): void => {
    setTargets(prev => ({
      ...prev,
      SalesLevels: [...prev.SalesLevels, { description: '', averageLevel: null } as SalesLevels]
    }));
  };

  const deleteBuyLevel = (index: number): void => {
    setTargets(prev => ({
      ...prev,
      BuyLevels: prev.BuyLevels.filter((_, i) => i !== index)
    }));
  };

  const deleteSalesLevel = (index: number): void => {
    setTargets(prev => ({
      ...prev,
      SalesLevels: prev.SalesLevels.filter((_, i) => i !== index)
    }));
  };

  const updateBuyLevel = (index: number, field: keyof BuyLevels, value: string | number): void => {
    setTargets(prev => ({
      ...prev,
      BuyLevels: prev.BuyLevels.map((level, i) => 
        i === index ? { ...level, [field]: value } : level
      )
    }));
  };

  const updateSalesLevel = (index: number, field: keyof SalesLevels, value: string | number): void => {
    setTargets(prev => ({
      ...prev,
      SalesLevels: prev.SalesLevels.map((level, i) => 
        i === index ? { ...level, [field]: value } : level
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await addTargets(targets);
      router.push(`/investing/ViewAsset/${params.assetPublicId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
   <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <BackLink />
        <div className="ml-auto flex space-x-12 text-green"></div>
    </div>
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Buy Levels</h2>
        <div className="space-y-4">
          {targets.BuyLevels.map((level, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <input
                type="text"
                className="border rounded p-2"
                placeholder="Description"
                value={level.description || ''}
                onChange={(e) => updateBuyLevel(index, 'description', e.target.value)}
              />
              <input
                type="number"
                className="border rounded p-2"
                placeholder="Level"
                value={level.level || ''}
                onChange={(e) => updateBuyLevel(index, 'level', Number(e.target.value))}
              />
              <input
                type="number"
                className="border rounded p-2"
                placeholder="Average Level"
                value={level.averageLevel || ''}
                onChange={(e) => updateBuyLevel(index, 'averageLevel', Number(e.target.value))}
              />
              <button
                type="button"
                onClick={() => deleteBuyLevel(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBuyLevel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Buy Level
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Sales Levels</h2>
        <div className="space-y-4">
          {targets.SalesLevels.map((level, index) => (
            <div key={index} className="grid grid-cols-4 gap-4">
              <input
                type="text"
                className="border rounded p-2"
                placeholder="Description"
                value={level.description || ''}
                onChange={(e) => updateSalesLevel(index, 'description', e.target.value)}
              />
              <input
                type="number"
                className="border rounded p-2"
                placeholder="Level"
                value={level.level || ''}
                onChange={(e) => updateSalesLevel(index, 'level', Number(e.target.value))}
              />
              <input
                type="number"
                className="border rounded p-2"
                placeholder="Average Level"
                value={level.averageLevel || ''}
                onChange={(e) => updateSalesLevel(index, 'averageLevel', Number(e.target.value))}
              />
              <button
                type="button"
                onClick={() => deleteSalesLevel(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSalesLevel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Sales Level
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit
      </button>
    </form>
    </div>
  );
}