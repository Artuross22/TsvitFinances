"use client";

import { listAssetHistory } from "@/api/asset";
import { ListAssetHistory } from "@/types/asset";
import { useEffect, useState } from "react";
import { PositionType } from "@/types/enums";

interface PageProps {
  assetId: string;
}

export const ListAssetHistoryPage = ({ assetId }: PageProps) => {
  const [historyItems, setHistoryItems] = useState<ListAssetHistory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const data = await listAssetHistory(assetId);
        setHistoryItems(data || []);
      } catch (error) {
        console.error("Failed to load asset history", error);
        setErrorMessage("Failed to load asset history. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [assetId]);

  const formatNumber = (value: number) =>
    Number.isFinite(value) ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-";

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Asset History</h2>

      {errorMessage && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{errorMessage}</div>
      )}

      {isLoading ? (
        <div className="text-gray-500">Loading...</div>
      ) : historyItems.length === 0 ? (
        <div className="text-gray-500">No history records yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyItems.map((item, index) => {
                const total = (item.quantity ?? 0) * (item.price ?? 0);
                const isBuy = item.type === PositionType.Long;
                return (
                  <tr key={`${item.publicId}-${index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-gray-700">{index + 1}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isBuy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {PositionType[item.type]}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-medium">{formatNumber(item.quantity)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-900">${formatNumber(item.price)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-semibold">${formatNumber(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListAssetHistoryPage;