"use client"

import React, { useEffect, useState } from 'react';
import { editAsset, getAsset } from '@/utils/asset';
import { Asset } from '@/types/asset';


interface AssetFormProps {
  id: string;
}

const AssetForm: React.FC<AssetFormProps> = ({ id }) => {
  const [formAsset, setFormAsset] = useState<Asset | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const asset = await getAsset(id);
      setFormAsset(asset);
    };

    fetchAsset();
  }, [id]);

  if (!formAsset) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    editAsset(formAsset);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm p-12 border border-base-300 rounded-lg">
      <input type="hidden" name="id" value={formAsset.id} />
      <label>
        Name:
        <input value={formAsset.name} onChange={e => setFormAsset({...formAsset, name: e.target.value} as Asset)} required/>
      </label>
      <label>
        Current Price:
        <input type="number" value={formAsset.currentPrice} onChange={e => setFormAsset({...formAsset, currentPrice: Number(e.target.value)} as Asset)} required/>
      </label>
      <label>
        Bought For:
        <input type="number" value={formAsset.boughtFor} onChange={e => setFormAsset({...formAsset, boughtFor: Number(e.target.value)} as Asset)} required/>
      </label>
      <label>
        Profit:
        <input type="number" value={formAsset.profi} onChange={e => setFormAsset({...formAsset, profi: Number(e.target.value)} as Asset)} required/>
      </label>
      <label>
        Active:
        <input type="checkbox" checked={formAsset.active} onChange={e => setFormAsset({...formAsset, active: e.target.checked} as Asset)} required/>
      </label>
      {/* Add other input fields similarly */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default AssetForm;