"use client";
import Link from "next/link";

interface AssetStrategyProps {
  strategyPublicId: string | null;
  strategyName: string | null;
  publicId: string;
}

const AssetStrategy = ({
  strategyName,
  publicId,
  strategyPublicId,
}: AssetStrategyProps) => {
  return (
    <div className="bg-gray-300 m-2 p-2">
      {strategyName && (
        <div className="">
          <Link
            href={`/strategy/View/${strategyPublicId}`}
            className="text-green-600 hover:underline font-medium"
          >
            <p>StrategyName: {strategyName}</p>
          </Link>
        </div>
      )}

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
