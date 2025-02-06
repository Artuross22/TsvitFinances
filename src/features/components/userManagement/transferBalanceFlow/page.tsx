"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { transferBalanceFlow } from "@/utils/user";

export interface TransferBalanceFlow {
  appUserId: string | "";
  fromBalanceFlow: BalanceFlow;
  toBalanceFlow: BalanceFlow;
}

interface BalanceFlow {
  sum: string;
  balanceType: Balance;
}

export enum Balance {
  Income = 1,
  Outcome,
  InternalRevenue,
  Total,
  Crypto,
  Stock,
  ReserveOne = 10,
  ReserveTwo,
  ReserveThree,
}

export const TransferBalance: React.FC = () => {
  const [fromBalanceFlows, setFromBalanceFlows] = useState<BalanceFlow>({
    sum: "",
    balanceType: Balance.Income,
  });
  const [toBalanceFlows, setToBalanceFlows] = useState<BalanceFlow>({
    sum: "",
    balanceType: Balance.Outcome,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSumChange = (flowType: "from" | "to", value: string) => {
    if (flowType === "from") {
      setFromBalanceFlows((prev) => ({ ...prev, sum: value }));
    } else {
      setToBalanceFlows((prev) => ({ ...prev, sum: value }));
    }
  };

  const handleTypeChange = (flowType: "from" | "to", value: Balance) => {
    if (flowType === "from") {
      if (value === toBalanceFlows.balanceType) {
        setError("From and To types cannot be the same.");
      } else {
        setError(null);
        setFromBalanceFlows((prev) => ({ ...prev, balanceType: Number(value) }));
      }
    } else {
      if (value === fromBalanceFlows.balanceType) {
        setError("From and To types cannot be the same.");
      } else {
        setError(null);
        setToBalanceFlows((prev) => ({ ...prev, balanceType: Number(value) }));
      }
    }
  };

  const submitBalanceFlows = async () => {
    if (fromBalanceFlows.balanceType === toBalanceFlows.balanceType) {
      setError("From and To types cannot be the same.");
      return;
    }

    try {
      const payload: TransferBalanceFlow = {
        appUserId: "",
        fromBalanceFlow: fromBalanceFlows,
        toBalanceFlow: toBalanceFlows,
      };
      await transferBalanceFlow(payload);

      setFromBalanceFlows({ sum: "", balanceType: Balance.Income });
      setToBalanceFlows({ sum: "", balanceType: Balance.Outcome });
      setError(null);
    } catch (error) {
      console.error("Error transferring balance:", error);
    }
  };

  const balanceOptions = Object.entries(Balance)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({
      label: key,
      value: value,
    }));

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Transfer Balance</h2>
      </div>
      <div className="space-y-4 mt-4">
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={fromBalanceFlows.sum}
            onChange={(e) => handleSumChange("from", e.target.value)}
            placeholder="From"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={fromBalanceFlows.balanceType.toString()}
            onChange={(e) => handleTypeChange("from", Number(e.target.value))}
            className="w-[180px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {balanceOptions.map(({ label, value }) => (
              <option key={value} value={value.toString()}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="number"
            value={toBalanceFlows.sum}
            onChange={(e) => handleSumChange("to", e.target.value)}
            placeholder="To"
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={toBalanceFlows.balanceType.toString()}
            onChange={(e) => handleTypeChange("to", Number(e.target.value))}
            className="w-[180px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {balanceOptions.map(({ label, value }) => (
              <option key={value} value={value.toString()}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={submitBalanceFlows}
          disabled={fromBalanceFlows.balanceType === toBalanceFlows.balanceType}
          className="flex items-center gap-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" /> Submit Transfer
        </button>
      </div>
    </div>
  );
};

export default TransferBalance;