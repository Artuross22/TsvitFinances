import { getAuthStatus } from "@/api/interactiveBrokers";
import { AuthStatus } from "@/types/interactiveBrokers";
import { useEffect, useState } from "react";

export const AuthStatusInfo = () => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const data = await getAuthStatus();
      setAuthStatus(data);
    };

    fetchAuthStatus();
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
        </div>
        
        {authStatus ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Success:</span>
              {authStatus.success ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-red-600 font-medium">No</span>
              )}
            </div>
            {authStatus.error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
                Error: {authStatus.error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Authenticated:</span>
              {authStatus.data?.authenticated ? (
                <span className="text-green-600 font-medium">Yes</span>
              ) : (
                <span className="text-red-600 font-medium">No</span>
              )}
            </div>
            <div className="text-gray-500 text-sm">
              Message: {authStatus.data?.message ?? "—"}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">Loading...</div>
        )}
      </div>
    </>
  );
};

export default AuthStatusInfo;
