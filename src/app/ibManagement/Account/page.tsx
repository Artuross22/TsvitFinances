"use client";

import AuthStatusInfo from "@/features/components/ibManagement/getAuthStatus/page";
import IBAccounts from "@/features/components/ibManagement/getAccounts/page";
import BackLink from "@/features/components/useful/BackLink";

export const Page = () => {
  return (
    <>
      <div>
        <div className="flex bg-gray-200 justify-center mt-2 px-2">
          <div className="absolute left-1 text-green">
            <BackLink />
          </div>

          <h2>
            <strong>Interactive brokers</strong>
          </h2>
        </div>

        <div className="flex">
          <div className="w-1/2 m-4 p-4">
            <IBAccounts />
          </div>

          <div className="w-1/2 m-4 p-4">
            <AuthStatusInfo /> 
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;