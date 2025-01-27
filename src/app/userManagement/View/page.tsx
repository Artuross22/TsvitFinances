"use client";

import { viewUserGet } from "@/utils/user";
import { useEffect, useState } from "react";
import AddBalanceFlow from "../../../features/components/userManagement/addBalanceFlow/page";

export interface ViewUser {
    id: string;
    email: string;
    nickname: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    createdOn: Date;
    totalBalance: number;
    balanceFlows?: BalanceFlow[];
}

interface BalanceFlow {
    id: number;
    sum: number;
    balanceType: string;
    createdOn: Date;
}

export const UserManagement = () => {
    const [user, setUser] = useState<ViewUser | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await viewUserGet();
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, []);

    if (!user) return <div className="p-4 text-center">Loading user data...</div>;

    return (
        <>
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-100 border-b">
                <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <p className="font-semibold text-gray-600">ID:</p>
                    <p>{user.id}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Email:</p>
                    <p>{user.email}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Nickname:</p>
                    <p>{user.nickname}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Name:</p>
                    <p>{user.firstName} {user.lastName}</p>
                </div>
                {user.phoneNumber && (
                    <div>
                        <p className="font-semibold text-gray-600">Phone Number:</p>
                        <p>{user.phoneNumber}</p>
                    </div>
                )}
                <div>
                    <p className="font-semibold text-gray-600">Created On:</p>
                    <p>{user.createdOn.toLocaleString()}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-600">Total Balance:</p>
                    <p>${user.totalBalance.toFixed(2)}</p>
                </div>
                {user.balanceFlows && user.balanceFlows.length > 0 && (
                    <div>
                        <p className="font-semibold text-gray-600">Balance Flows:</p>
                        {user.balanceFlows.map((flow) => (
                            <div key={flow.id} className="border-t pt-2 mt-2">
                                <p>Amount: ${flow.sum.toFixed(2)}</p>
                                <p>Type: {flow.balanceType}</p>
                                <p>Date: {flow.createdOn.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>

        <AddBalanceFlow/>
        
        </>
    );
}

export default UserManagement;