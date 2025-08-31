import { getAccounts } from "@/api/interactiveBrokers";
import { AccountInfo } from "@/types/interactiveBrokers";
import { useEffect, useState } from "react";

export const IBAccounts = () => {
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaperAccount = async () => {
      try {
        setLoading(true);
        const data = await getAccounts();
        setAccount(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch account');
        setAccount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperAccount();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading account...</div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 max-w-md bg-gray-50 shadow-sm">
        {error ? (
          <div className="text-red-600 border border-red-200 rounded-lg p-4 min-w-[250px] max-w-xs bg-red-50 shadow-sm flex-1">
            Error: {error}
          </div>
        ) : account ? (
          <div className="border border-gray-200 rounded-lg p-4 min-w-[250px] max-w-xs bg-gray-50 shadow-sm flex-1">
            <div className="font-medium text-lg mb-1">{account.alias}</div>
            <div className="text-gray-500 text-sm mb-1">
              ID: {account.accountId}
            </div>
            <div className={`font-semibold ${account.isPaperAccount ? "text-blue-600" : "text-green-600"}`}>
              {account.isPaperAccount ? "Paper Account" : "Live Account"}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No account found</div>
        )}
      </div>
    </>
  );
};

export default IBAccounts;
