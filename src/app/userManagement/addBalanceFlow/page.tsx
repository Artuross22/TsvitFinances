"use client";

import React, { useState } from 'react';
import { addBalanceFlow } from "@/utils/user";

enum Balance {
    Income = 1,
    Outcome,
    InternalRevenue,
    Total,
    Crypto,
    Stock,
    ReserveOne = 10,
    ReserveTwo,
    ReserveThree
}

export interface AddBalanceFlow {
    sum: string;
    balanceType: Balance;
}

export const AddBalanceFlow: React.FC = () => {
    const [balanceFlows, setBalanceFlows] = useState<AddBalanceFlow[]>([]);
    const [currentFlow, setCurrentFlow] = useState<AddBalanceFlow>({
        sum: '',
        balanceType: Balance.Income
    });
    const [error, setError] = useState<string | null>(null);

    const addFlow = () => {
        const numericSum = parseFloat(currentFlow.sum);
        if (isNaN(numericSum) || numericSum <= 0) {
            setError('Enter a valid positive number');
            return;
        }

        setBalanceFlows([...balanceFlows, currentFlow]);
        setCurrentFlow({ sum: '', balanceType: Balance.Income });
        setError(null);
    };

    const submitBalanceFlows = async () => {
        if (balanceFlows.length === 0) {
            setError('Add at least one balance flow');
            return;
        }

        try {
            await addBalanceFlow(balanceFlows);
            setBalanceFlows([]);
            setError(null);
        } catch (err) {
            setError('Failed to add balance flows');
            console.error(err);
        }
    };

    return (
        <div className="p-4">
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={currentFlow.sum}
                    onChange={(e) => setCurrentFlow({...currentFlow, sum: e.target.value})}
                    placeholder="Amount"
                    className="flex-grow p-2 border rounded"
                />
                <select
                    value={currentFlow.balanceType}
                    onChange={(e) => setCurrentFlow({...currentFlow, balanceType: Number(e.target.value) as Balance})}
                    className="p-2 border rounded"
                >
                    {Object.entries(Balance)
                        .filter(([key]) => isNaN(Number(key)))
                        .map(([key, value]) => (
                            <option key={key} value={value}>{key}</option>
                        ))}
                </select>
                <button 
                    onClick={addFlow} 
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Add Flow
                </button>
            </div>

            {balanceFlows.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-bold mb-2">Current Flows:</h3>
                    {balanceFlows.map((flow, index) => (
                        <div key={index} className="border p-2 mb-1 flex justify-between">
                            <span>{flow.sum} - {Balance[flow.balanceType]}</span>
                            <button 
                                onClick={() => setBalanceFlows(balanceFlows.filter((_, i) => i !== index))}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <button 
                onClick={submitBalanceFlows}
                className="w-full bg-blue-500 text-white p-2 rounded"
                disabled={balanceFlows.length === 0}
            >
                Submit Balance Flows
            </button>
        </div>
    );
}

export default AddBalanceFlow;