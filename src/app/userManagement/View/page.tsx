"use client";

import React from "react";
import { useEffect, useState } from "react";
import { viewUserGet } from "@/utils/user";
import AddBalanceFlow from "../../../features/components/userManagement/addBalanceFlow/page";
import RemoveBalanceFlow from "@/features/components/userManagement/removeBalanceFlow/page";
import {
  User,
  CreditCard,
  Clock,
  Mail,
  Phone,
  DollarSign,
  BookUser,
} from "lucide-react";
import UserBalanceHistory from "@/features/components/userManagement/balanceHistory/page";

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
  if (value === undefined || value === null) return "$0.00";
  return `$${Math.abs(value).toFixed(2)}`;
};

const UserInfoItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ElementType;
}) => (
  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
    {Icon && <Icon className="w-5 h-5 text-blue-600" />}
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  </div>
);

export const UserManagement = () => {
  const [user, setUser] = useState<ViewUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await viewUserGet();
        setUser(data);
      } catch (error) {
        setError("Failed to fetch user data. Please try again later.");
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="mx-auto w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-700 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-5 flex items-center space-x-4">
              <User className="w-8 h-8" />
              <h2 className="text-xl font-bold">User Profile</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <UserInfoItem label="ID" value={user.id} icon={CreditCard} />
              <UserInfoItem label="Email" value={user.email} icon={Mail} />
              <UserInfoItem
                label="Nickname"
                value={user.nickname}
                icon={BookUser}
              />
              <UserInfoItem
                label="Name"
                value={`${user.firstName} ${user.lastName}`}
                icon={User}
              />
              {user.phoneNumber && (
                <UserInfoItem
                  label="Phone Number"
                  value={user.phoneNumber}
                  icon={Phone}
                />
              )}
              <UserInfoItem
                label="Created On"
                value={new Date(user.createdOn).toLocaleDateString()}
                icon={Clock}
              />
              <UserInfoItem
                label="Total Balance"
                value={formatCurrency(user.totalBalance)}
                icon={DollarSign}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="flex border-b">
              <button
                className={`flex-1 p-4 ${activeTab === "add" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setActiveTab("add")}
              >
                Add Balance
              </button>
              <button
                className={`flex-1 p-4 ${activeTab === "remove" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setActiveTab("remove")}
              >
                Remove Balance
              </button>
            </div>
            <div className="p-6">
              {activeTab === "add" ? <AddBalanceFlow /> : <RemoveBalanceFlow />}
            </div>
          </div>
        </div>

        <UserBalanceHistory user={user} />
      </div>
    </div>
  );
};

export default UserManagement;
