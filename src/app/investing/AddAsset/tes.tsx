"use client";

import { Asset } from '@/types/asset';
import { createAssetGet } from '@/utils/asset';
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';

interface FormState {
  files: File[];
  name: string;
  age: string;
  uploading: boolean;
}

const initialAsset: Partial<Asset> = {
  files: [],
};


export default function FileUploader(): JSX.Element {
  const [formState, setFormState] = useState<Partial<Asset>>(initialAsset);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFormState(prev => ({
      ...prev,
      files: selectedFiles
    }));
  };
  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { files, name } = formState;
    
    if (files?.length === 0 || !name ) {
      setMessage('Please fill all fields and select files');
      return;
    }

    setFormState(prev => ({ ...prev, uploading: true }));
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      
      files?.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('https://localhost:44309/api/Assets/SS', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      setMessage('Files uploaded successfully!');
      setFormState(prev => ({ ...prev, files: [] }));
    } catch (error) {
      setMessage('Error uploading files. Please try again.');
    } finally {
      setFormState(prev => ({ ...prev, uploading: false }));
    }
  };

  return (
    <form onSubmit={handleUpload} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>


      <input
        type="file"
        onChange={handleFileChange}
        multiple
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      
      {formState?.files!.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected files:</h3>
          <ul className="space-y-2">
            {formState?.files?.map((file, index) => (
              <li key={index} className="flex items-center space-x-2">
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
                <span className="text-sm truncate">{file.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* <button
        type="submit"
        disabled={formState.uploading}
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {formState.uploading ? 'Uploading...' : 'Upload Files'}
      </button> */}

      {message && (
        <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </form>
  );
}