"use client";
import Link from "next/link";

interface AssetStrategyProps {
  strategyName: string | null;
  publicId: string;
}

const AssetStrategy = ({ strategyName, publicId }: AssetStrategyProps) => {
  return (
    <div className="bg-gray-300 m-2 p-2">
      {strategyName && <p>StrategyName: {strategyName}</p>}
      <strong>
        <Link
          href={`/strategy/AddStrategyToAsset/${publicId}`}
          className="text-green-500 hover:underline font-medium"
        >
          {strategyName ? "Change Strategy →" : "Add Strategy →"}
        </Link>
      </strong>
    </div>
  );
};

export default AssetStrategy;
