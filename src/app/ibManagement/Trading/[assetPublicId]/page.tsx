"use client";

import IBAccounts from "@/features/components/ibManagement/getAccounts/page";
import AuthStatusInfo from "@/features/components/ibManagement/getAuthStatus/page";
import GetOrderlimits from "@/features/components/ibManagement/getOrders/page";
import PlaceLimitOrder from "@/features/components/ibManagement/placeLimitOrder/page";
import PlaceMarketOrder from "@/features/components/ibManagement/placeMarketOrder/page";
import BackLink from "@/features/components/useful/BackLink";

interface Props {
    params: {
      assetPublicId: string;
    };
  }

export const Page = ({ params }: Props) => {
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
      </div>


    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IBAccounts />
          <AuthStatusInfo />
        </div>
      </div>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Market Order</h3>
                      <p className="text-sm text-gray-500">Execute at current market price</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Fast
                  </span>
                </div>
                <PlaceMarketOrder params={params} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Limit Order</h3>
                      <p className="text-sm text-gray-500">Set your desired price</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Precise
                  </span>
                </div>
                <PlaceLimitOrder params={params} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Live Orders</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Monitor your active orders and their status
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">Real-time</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <GetOrderlimits />
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Page;
