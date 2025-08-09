"use client";

import AddAssetHistoryPage from "@/features/components/asset/assetHistory/AddAssetHistory";
import { ListAssetHistoryPage } from "@/features/components/asset/assetHistory/ListAssetHistory";
import BackLink from "@/features/components/useful/BackLink";

interface Props {
  params: {
    assetId: string;
  };
}

export const Page = ({ params }: Props) => {
  return (
    <>
      <div className="flex bg-gray-200 justify-center mt-2 px-2">
        <div className="absolute left-1 text-green">
          <BackLink />
        </div>
        <h2 className="text-lg">Asset History</h2>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        <AddAssetHistoryPage assetId={params.assetId} />
        <ListAssetHistoryPage assetId={params.assetId} />
      </div>
    </>
  );
};

export default Page;