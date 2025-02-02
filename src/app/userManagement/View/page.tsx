"use client";

import React from 'react';
import { useEffect, useState } from "react";
import { viewUserGet } from "@/utils/user";
import AddBalanceFlow from "../../../features/components/userManagement/addBalanceFlow/page";
import RemoveBalanceFlow from '@/features/components/userManagement/removeBalanceFlow/page';

export interface ViewUser {
    id: string;
    email: string;
    nickname: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    createdOn: Date;
    totalBalance: number;
    groupedBalanceFlows?: GroupedBalanceFlow[];
}

interface GroupedBalanceFlow {
    totalSum: number;
    balanceType: string;
    balanceFlows?: BalanceFlow[];
}

interface BalanceFlow {
    id: number;
    sum: number;
    balanceType: string;
    createdOn: Date;
}

const formatCurrency = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '$0.00';
    return `$${value.toFixed(2)}`;
};

const UserInfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base">{value}</p>
    </div>
);

const BalanceFlowItem = ({ flow }: { flow: BalanceFlow }) => (
    <div className="border rounded-lg bg-gray-50 ">
        <div className="flex justify-between items-center">
            <span className="font-medium">{formatCurrency(flow?.sum)}</span>
            <span className="text-sm text-gray-500">
                {flow?.createdOn ? new Date(flow.createdOn).toLocaleDateString() : '-'}
            </span>
        </div>
        <div className="text-sm text-gray-600">
            Type: {flow?.balanceType || '-'}
        </div>
    </div>
);

export const UserManagement = () => {
    const [user, setUser] = useState<ViewUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await viewUserGet();
                setUser(data);
            } catch (error) {
                setError('Failed to fetch user data. Please try again later.');
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto p-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-3xl mx-auto p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>

<div className="h-screen flex">
      <div className="w-1/2 flex items-center">
                <div className="w-full max-w-3xl mx-auto p-8 space-y-8">
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UserInfoItem label="ID" value={user.id} />
                        <UserInfoItem label="Email" value={user.email} />
                        <UserInfoItem label="Nickname" value={user.nickname} />
                        <UserInfoItem 
                            label="Name" 
                            value={`${user.firstName} ${user.lastName}`} 
                        />
                        {user.phoneNumber && (
                            <UserInfoItem 
                                label="Phone Number" 
                                value={user.phoneNumber} 
                            />
                        )}
                        <UserInfoItem 
                            label="Created On" 
                            value={new Date(user.createdOn).toLocaleDateString()} 
                        />
                        <UserInfoItem 
                            label="Total Balance" 
                            value={formatCurrency(user.totalBalance)} 
                        />
                    </div>
                </div>
            </div>

            <AddBalanceFlow />

            <RemoveBalanceFlow />
       </div>
      </div>
      <div className="w-1/2 flex items-center">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6 w-full">
    <div>
    {user.groupedBalanceFlows && user.groupedBalanceFlows.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Balance History</h3>
          <div className="grid grid-cols-2 gap-4">
            {user.groupedBalanceFlows.map((group, index) => (
              <div key={`${group.balanceType}-${index}`} className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className={`font-medium ${group.balanceType === 'Outcome' ? 'text-red-500' : 'text-gray-500'}`}>{group.balanceType || '-'}</h4>
                  <span className={`text-sm ${group.balanceType === 'Outcome' ? 'text-red-500' : 'text-gray-500'}`}>
                    Total: {group.balanceType === 'Outcome' ? `-${formatCurrency(group?.totalSum)}` : formatCurrency(group?.totalSum)}
                  </span>
                </div>
                {group.balanceFlows && group.balanceFlows.length > 0 && (
                  <div className="space-y-2">
                    {group.balanceFlows.map((flow) => (
                      <BalanceFlowItem key={flow.id} flow={flow} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
         </div> 
    </div>
        </>
    );
};

export default UserManagement;