"use client";

import { GetOrders } from "@/api/interactiveBrokers";
import { Orderlimits } from "@/types/interactiveBrokers";
import { useEffect, useState } from "react";

export const GetOrderlimits = () => {
    const [orders, setOrders] = useState<Orderlimits[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const data = await GetOrders();
                setOrders(data || []);
                setError(null);
            } catch (err) {
                setError("Failed to fetch orders");
                console.error("Error fetching orders:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'filled':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getSideColor = (side: string) => {
        return side.toLowerCase() === 'buy' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800';
    };

    const formatQuantity = (quantity: number) => {
        return quantity.toLocaleString();
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {orders.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                    <p className="mt-1 text-sm text-gray-500">There are currently no live orders to display.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ticker
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Side
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Remaining
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order, index) => (
                                <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.orderId}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.orderType}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Account: {order.accountId}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {order.ticker}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.contractId}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSideColor(order.side)}`}>
                                            {order.side.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatQuantity(order.quantity)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.remainingQuantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatPrice(order.price)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GetOrderlimits;