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
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
        </div>
        
        {error ? (
          <div className="text-red-600 border border-red-200 rounded-lg p-4 bg-red-50">
            Error: {error}
          </div>
        ) : account ? (
          <div className="space-y-3">
            <div className="font-medium text-lg text-gray-900">{account.alias}</div>
            <div className="text-gray-500 text-sm">
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
