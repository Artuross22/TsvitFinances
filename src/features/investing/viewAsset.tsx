import { getAsset } from '@/utils/asset';

interface Asset {
  id: string;
  name: string;
  currentPrice: number;
  addedAt: Date;
  boughtFor: number;
  profit: number;
  active: boolean;
  closedAt: Date;
}

const ViewAsset: React.FC<Asset> = async ({ id }) => {
  const asset = await getAsset(id);

  if (!asset) {
    return null; // or handle the case when props is null
  }

  return (
    <div style={{ width: '50%', float: 'left' }}>
      <div style={{ backgroundColor: 'lightgray', margin: '1%', padding: '2%' }}>
        <h1>{asset.name}</h1>
        <p>Current Price: {asset.currentPrice}</p>
        <p>Added At: {asset.addedAt.toLocaleString()}</p>
        <p>Bought For: {asset.boughtFor}</p>
        <p>Profit: {asset.currentPrice - asset.boughtFor}</p>
        <p>Active: {asset.active ? 'Yes' : 'No'}</p>
        <p>Closed At: {asset.closedAt.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ViewAsset;
