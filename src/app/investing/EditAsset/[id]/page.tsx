import EditAsset from "@/features/investing/editAsset";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <EditAsset id={params.id} />
    </div>
  );
};

export default Page;
