"use client";

import React, { useState } from "react";
import { DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { ViewUser } from "@/app/userManagement/View/page";

const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return "$0.00";
  return `$${Math.abs(value).toFixed(2)}`;
};

interface UserBalanceHistoryProps {
  user: ViewUser;
}

const UserBalanceHistory: React.FC<UserBalanceHistoryProps> = ({ user }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="bg-blue-600 text-white p-5 flex items-center space-x-4">
        <DollarSign className="w-8 h-8" />
        <h3 className="text-xl font-bold">Balance History</h3>
      </div>
      {user?.groupedBalanceFlows && user.groupedBalanceFlows.length > 0 ? (
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {user.groupedBalanceFlows.map((group) => {
              
              const groupId = `${group.balanceType}-${group.totalSum}`;
              const isExpanded = expandedGroups.has(groupId);

              return (
                <div key={groupId} className="bg-gray-50 rounded-lg p-4">
                  <button
                    onClick={() => toggleGroup(groupId)}
                    className="w-full"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-600" />
                        )}
                        <h5
                          className={`font-semibold text-sm ${group.balanceType === "Outcome" ? "text-red-600" : "text-green-600"}`}
                        >
                          {group.balanceType || "-"}
                        </h5>
                      </div>
                      <span
                        className={`font-medium text-sm ${group.balanceType === "Outcome" ? "text-red-600" : "text-green-600"}`}
                      >
                        {group.balanceType === "Outcome"
                          ? `-${formatCurrency(group?.totalSum)}`
                          : formatCurrency(group?.totalSum)}
                      </span>
                    </div>
                  </button>

                  {isExpanded &&
                    group.balanceFlows &&
                    group.balanceFlows.length > 0 && (
                      <div className="space-y-2 max-h-64 overflow-y-auto mt-4">
                        {group.balanceFlows.map((flow) => (
                          <div
                            key={flow.id}
                            className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex justify-between items-center">
                              <span
                                className={`font-semibold text-sm ${flow.sum > 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {flow.sum > 0 ? "+" : ""}
                                {formatCurrency(flow.sum)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {flow?.createdOn
                                  ? new Date(
                                      flow.createdOn,
                                    ).toLocaleDateString()
                                  : "-"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Type: {flow?.balanceType || "-"}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No balance history available
        </div>
      )}
    </div>
  );
};

export default UserBalanceHistory;
