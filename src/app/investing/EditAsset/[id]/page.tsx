import EditAsset from "@/features/investing/editAsset";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  return <EditAsset id={params.id} />;
};

export default Page;
