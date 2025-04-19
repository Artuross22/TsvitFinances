"use client";

import { addBalanceFlow } from "@/api/user";
import React, { useState } from "react";
import { Balance } from "@/types/balanceFlow";


export interface AddBalanceFlow {
  appUserId: string | "";
  balanceFlows: BalanceFlow[];
}

interface BalanceFlow {
  sum: string;
  balanceType: Balance;
}

export const AddBalanceFlowComponent: React.FC = () => {
  const [currentFlow, setCurrentFlow] = useState<BalanceFlow>({
    sum: "",
    balanceType: Balance.Income,
  });
  const [balanceFlows, setBalanceFlows] = useState<BalanceFlow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addFlow = () => {
    const numericSum = parseFloat(currentFlow.sum);
    if (isNaN(numericSum) || numericSum <= 0) {
      setError("Enter a valid positive number");
      return;
    }

    setBalanceFlows([...balanceFlows, currentFlow]);
    setCurrentFlow({ sum: "", balanceType: Balance.Income });
    setError(null);
  };

  const submitBalanceFlows = async () => {
    if (balanceFlows.length === 0) {
      setError("Add at least one balance flow");
      return;
    }

    const flowData: AddBalanceFlow = {
      appUserId: "",
      balanceFlows: balanceFlows,
    };

    try {
      await addBalanceFlow(flowData);
      setBalanceFlows([]);
      setCurrentFlow({ sum: "", balanceType: Balance.Income });
      setError(null);
    } catch (err) {
      setError("Failed to add balance flows");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={currentFlow.sum}
          onChange={(e) =>
            setCurrentFlow({ ...currentFlow, sum: e.target.value })
          }
          placeholder="Amount"
          className="flex-grow p-2 border rounded"
        />
        <select
          value={currentFlow.balanceType}
          onChange={(e) =>
            setCurrentFlow({
              ...currentFlow,
              balanceType: Number(e.target.value) as Balance,
            })
          }
          className="p-2 border rounded"
        >
          {Object.entries(Balance)
            .filter(([key]) => isNaN(Number(key)))
            .map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
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
              <span>
                Amount: {flow.sum} - Type: {Balance[flow.balanceType]}
              </span>
              <button
                onClick={() =>
                  setBalanceFlows(balanceFlows.filter((_, i) => i !== index))
                }
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
};

export default AddBalanceFlowComponent;