import { getAsset } from "@/utils/asset";

interface AssetFormValues {
  id: string;
}

const ViewAsset: React.FC<AssetFormValues> = async ({ id }) => {
  const asset = await getAsset(id);

  if (!asset) {
    return null; // or handle the case when props is null
  }

  return (
    <form>
      <label>
        Name:
        <input type="text" name="name" defaultValue={asset.name} required/>
      </label>
      <label>
        Current Price:
        <input type="number" name="currentPrice" defaultValue={asset.currentPrice} required/>
      </label>
      <label>
        Bought For:
        <input type="number" name="boughtFor" defaultValue={asset.boughtFor} required/>
      </label>
      <label>
        Profi:
        <input type="number" name="profi" defaultValue={asset.profi} required/>
      </label>
      <label>
        Active:
        <input type="checkbox" name="active" defaultChecked={asset.active}/>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
export default ViewAsset;
