import { getPaperAccounts } from "@/api/interactiveBrokers";
import { PaperAccount } from "@/types/interactiveBrokers";
import { useEffect, useState } from "react";

export const ListPaperAccounts = () => {
  const [paperAccounts, setPaperAccounts] = useState<PaperAccount>({
    error: null,
    data: [],
  });

  useEffect(() => {
    const fetchPaperAccounts = async () => {
      const data = await getPaperAccounts();
      setPaperAccounts(data);
    };

    fetchPaperAccounts();
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Paper Accounts</h2>
      <div className="border border-gray-200 rounded-lg p-4 max-w-md bg-gray-50 shadow-sm">
        {paperAccounts.error ? (
          <div className="text-red-600 border border-red-200 rounded-lg p-4 min-w-[250px] max-w-xs bg-red-50 shadow-sm flex-1">
            Error: {paperAccounts.error}
          </div>
        ) : paperAccounts.data && paperAccounts.data.length > 0 ? (
          paperAccounts.data.map((acc) => (
            <div
              key={acc.AccountId}
              className="border border-gray-200 rounded-lg p-4 min-w-[250px] max-w-xs bg-gray-50 shadow-sm flex-1"
            >
              <div className="font-medium text-lg mb-1">{acc.DisplayName}</div>
              <div className="text-gray-500 text-sm mb-1">
                ID: {acc.AccountId}
              </div>
              <div
                className={`font-semibold ${acc.AccountStatus === "Active" ? "text-green-600" : "text-red-600"}`}
              >
                Статус: {acc.AccountStatus}
              </div>
              <div className="text-gray-400 text-sm mt-1">Тип: {acc.Type}</div>
              <div className="text-gray-400 text-sm">
                Валюта: {acc.Currency}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-400">No accounts</div>
        )}
      </div>
    </>
  );
};

export default ListPaperAccounts;
