import { getAsset } from "@/utils/asset";
import Link from "next/link";

const EditAsset: React.FC<{ id: string }> = async ({ id }) => {
  const asset = await getAsset(id);

  if (!asset) {
    return null; // or handle the case when asset is null
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          backgroundColor: "lightgray",
          justifyContent: "center",
        }}
      >
        <Link
          href={`/investing/ViewAsset/${asset.id}`}
          style={{ position: "absolute", left: "1%", color: "green" }}
        >
          Back
        </Link>
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
        <p>Closed At: {asset.closedAt.toLocaleString()}</p>
      </div>
    </div>
  );
};
export default EditAsset;
