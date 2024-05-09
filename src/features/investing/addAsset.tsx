"use client";

import { createAsset } from '@/utils/asset';
import React, { useState } from 'react';
import { Asset } from '@/types/asset';

const initialAsset: Partial<Asset> = {
  active: true,
};

export default function AssetForm() {
  const [values, setValues] = useState(initialAsset);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createAsset(values);
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="join w-full">
        <input
          type="text"
          className="input input-bordered join-item w-full"
          placeholder="Asset name"
          name="name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
        />
        <input
          type="number"
          className="input input-bordered join-item w-full"
          placeholder="Current price"
          name="currentPrice"
          value={values.currentPrice}
          onChange={(e) => setValues({ ...values, currentPrice: Number(e.target.value) || undefined })}
          required
        />
        <input
          type="number"
          className="input input-bordered join-item w-full"
          placeholder="Profit"
          value={values.boughtFor}
          onChange={(e) => setValues({ ...values, boughtFor: Number(e.target.value) || undefined })}
        />
        <button type="submit" className="btn btn-primary join-item">
          Create Asset
        </button>
      </div>
    </form>
  );
}