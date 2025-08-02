"use client";

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

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <PlaceMarketOrder params={params} />
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <PlaceLimitOrder params={params} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
