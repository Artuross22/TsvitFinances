"use client";

import AddPositionEntryChart from "@/features/components/asset/positionEntryNotes/addPositionEntryChart";
import AddPositionEntryNotes from "@/features/components/asset/positionEntryNotes/addPositionEntryNotes";

interface AssetProps {
  params: { id: string; name: string };
}

const AssetForm: React.FC<AssetProps> = ({ params }) => {


  return (
    <>
      <AddPositionEntryChart params={params} />
      <AddPositionEntryNotes params={params} />
    </>
  );
};

export default AssetForm;
