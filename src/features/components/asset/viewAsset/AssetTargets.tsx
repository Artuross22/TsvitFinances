// "use client";

// import { applaStrategy, listTargets } from "@/utils/strategy";
// import { UUID } from "crypto";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface Props {
//     publicId: string;
//     strategyPublicId: string;
//   }

// export interface InputModel {
//     position: _Position;
//     risk: _Risk;
// }

// export interface Diversification {
//     totalNicheSum: number;
//     recommendedNichePercentage: number;
//     sector: String;
//     total: number;
// }

// export interface Range {
//     start?: number | null;
//     end: number;
// }

// export interface TargetLevels {
//     level: number;
//     averageLevel?: number | null;
// }

// export interface _Position {
//     buyTargets: Range[];
//     sellTargets: Range[];
// }

// export interface _Risk {
//     baseRisk: number;
//     riskToReward: number;
//     diversifications: Diversification[];
// }

//   const AssetTargets = ({publicId, strategyPublicId }: Props) => {

//     const [strategy, setStrategies] = useState<InputModel>();

//     useEffect(() => {
//       const fetchAssets = async () => {
//         const fetchedAssets = await listTargets(publicId);
//         setStrategies(fetchedAssets);
//       };
  
//       fetchAssets();
//     }, []);
  
//     return (
//         <div className="bg-gray-300 m-2 p-2"> 

//         <Link
//           href={`/investing/Target/addTargets/${strategyPublicId}/${publicId}`}
//           className="text-green-500 hover:underline font-medium" >Hoi
//         </Link>
   
//         </div>
//     );
//   };
//   export default AssetTargets;

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { deleteTarget, listTargets } from '@/utils/strategy';
import { UUID } from 'crypto';

interface AssetTargetsProps {
    publicId: string;
}

export interface TargetLevels {
    publicId: string;
    buyLevels: BuyLevels[];
    salesLevels: SaleLevels[];
}

interface SaleLevels {
    publicId: UUID;
    description?: string;
    level: number;
    averageLevel: number | null;
}

interface BuyLevels {
    publicId: UUID;
    description?: string;
    level: number;
    averageLevel: number | null;
}

const AssetTargets: React.FC<AssetTargetsProps> = ({publicId}) => {
    const [strategy, setStrategy] = useState<TargetLevels | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<UUID | null>(null);

    useEffect(() => {
        fetchAssets();
    }, [publicId]);

    const fetchAssets = async () => {
        try {
            setIsLoading(true);
            const fetchedAssets = await listTargets(publicId);
            setStrategy(fetchedAssets);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch assets');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (publicId: UUID, nameLevel : string) => {
        window.location.href = `/investing/Target/editTarget/${publicId}/${nameLevel}`;
    };

    const handleDelete = async (publicId: UUID, level: string) => {
        try {
            setIsDeleting(publicId);
            setError(null);
            
            const response = await deleteTarget(publicId, level);
            
            if (response) {
                setSuccessMessage(`Successfully deleted ${level === 'buyLevel' ? 'buy' : 'sale'} level`);
                await fetchAssets();
                
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 3000);
            }
        } catch (err) {
            setError('Failed to delete target: ' + err);
        } finally {
            setIsDeleting(null);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4">Loading...</div>;
    }

    return (
        
        <div className="bg-gray-300 m-2 p-2">
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{successMessage}</span>
                    <button 
                        onClick={() => setSuccessMessage(null)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={() => setError(null)}
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                    >
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>
            )}

            <div className="flex justify-between items-center py-3">
                <h1 className="text-2xl font-bold text-gray-800">Asset Targets</h1>
                <Link
                    href={`/investing/Target/addTargets/${publicId}`}
                    className="bg-green-500 text-white px-3 py- rounded-md hover:bg-green-600 transition-colors"
                >
                    Add New Target
                </Link>
            </div>

            {strategy && (
                <div className="grid gap-6">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">Buy Levels</h2>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Average Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {strategy.buyLevels.map((level: BuyLevels) => (
                                        <tr key={level.publicId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {level.level.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {level.averageLevel?.toFixed(2) ?? 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {level.description || 'No description'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                <button
                                                    onClick={() => handleEdit(level.publicId, "PurchaseLevels") }
                                                    className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(level.publicId, "PurchaseLevels")}
                                                    disabled={isDeleting === level.publicId}
                                                    className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                                                >
                                                    {isDeleting === level.publicId ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b bg-gray-50">
                            <h2 className="text-xl font-semibold text-gray-800">Sale Levels</h2>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Average Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {strategy.salesLevels.map((level: SaleLevels) => (
                                        <tr key={level.publicId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {level.level.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                {level.averageLevel?.toFixed(2) ?? 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {level.description || 'No description'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                <button
                                                    onClick={() => handleEdit(level.publicId, "SaleLevels")}
                                                    className="text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(level.publicId, "SaleLevels")}
                                                    disabled={isDeleting === level.publicId}
                                                    className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                                                >
                                                    {isDeleting === level.publicId ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetTargets;