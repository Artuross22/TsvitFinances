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
    <div className="bg-gray-200 rounded-lg shadow-md p-4 max-w-4xl mx-auto">
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
