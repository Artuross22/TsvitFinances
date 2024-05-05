import { editAsset, getAsset } from "@/utils/asset";
import Link from "next/link";

interface Asset {
  id: string;
}

const ViewAsset: React.FC<Asset> = async ({ id }) => {
  const asset = await getAsset(id);

  if (!asset) {
    return null;
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
          href={`/investing/ViewAsset/${id}`}
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "40vh",
        }}
      >
        <form action={editAsset}>
          <input type="hidden" name="id" value={asset.id} />
          <label htmlFor="name">
            Name
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={asset.name}
              required
            />
          </label>
          <br />
          <label htmlFor="currentPrice">
            Current Price
            <input
              type="number"
              id="currentPrice"
              name="currentPrice"
              defaultValue={asset.currentPrice}
              required
            />
          </label>
          <br />
          <label htmlFor="boughtFor">
            Bought For
            <input
              type="number"
              id="boughtFor"
              name="boughtFor"
              defaultValue={asset.boughtFor}
              required
            />
          </label>
          <br />
          <label htmlFor="profi">
            Profi
            <input
              type="number"
              id="profi"
              name="profi"
              defaultValue={asset.profi}
              required
            />
          </label>
          <br />
          <label htmlFor="active">
            Active
            <input
              type="checkbox"
              id="active"
              name="active"
              defaultChecked={asset.active}
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
export default ViewAsset;
