import { getAsset } from "@/utils/asset";
import Link from "next/link";
import DeleteForm from "../components/DeleteForm";

interface Asset {
  id: string;
}

const ViewAsset: React.FC<Asset> = async ({ id }) => {
  const asset = await getAsset(id);

  if (!asset) {
    return null; // or handle the case when props is null
  }

  return (
    <div>
      <div className="flex bg-gray-200 justify-center mt-2">
        <Link href={`/investing`} className="absolute left-1 text-green">
          Back
        </Link>
        <div className="absolute right-1 text-green">
          <DeleteForm id={id} />
        </div>
        <h2>
          <strong>{asset.name}</strong>
        </h2>
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: "lightgray",
          margin: "1%",
          padding: "2%",
        }}
      >
        <h1>{asset.name}</h1>
        <p>Current Price: {asset.currentPrice}</p>
        <p>Added At: {asset.addedAt.toLocaleString()}</p>
        <p>Bought For: {asset.boughtFor}</p>
        <p>Profit: {asset.currentPrice - asset.boughtFor}</p>
        <p>Active: {asset.active ? "Yes" : "No"}</p>
        {!asset.active &&  <p>Closed At: {asset.closedAt.toLocaleString()}</p>}
        <div>
          <Link href={`/investing/EditAsset/${asset.id}`}>Edit</Link>
        </div>
      </div>
    </div>
  );
};
export default ViewAsset;
