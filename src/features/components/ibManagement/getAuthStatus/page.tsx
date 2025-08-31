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
      <div className="border border-gray-200 rounded-lg p-4 max-w-md bg-gray-50 shadow-sm">
        {authStatus ? (
          <>
            <div className="text-gray-500 text-sm mt-2">
              Success:{" "}
              {authStatus.success ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </div>
            {authStatus.error && (
              <div className="text-red-600 text-sm mt-2">
                Error: {authStatus.error}
              </div>
            )}
            <div className="font-medium text-lg mb-1">
              Authenticated:{" "}
              {authStatus.data?.authenticated ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </div>
            <div className="text-gray-500 text-sm mt-2">
              Message: {authStatus.data?.message ?? "—"}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
};

export default AuthStatusInfo;
