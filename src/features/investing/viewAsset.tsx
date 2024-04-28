import { getAsset } from '@/utils/asset';
import React from 'react'

type ViewAssetProps = {
  id: string;
}

const ViewAsset: React.FC<ViewAssetProps> = async ({ id }) => { 
  const asset = await getAsset(id)

  return (
    <div>    
      <p>View Asset!</p>
      <p>{String(asset?.addedAt)}</p>
    </div>
  )
}

export default ViewAsset