"use client";
import Link from "next/link";
import Image from "next/image";
import { ViewChart } from "@/types/assetsDto";

interface AssetChartsProps {
  charts: ViewChart[];
  publicId: string;
  name: string;
}

const AssetCharts = ({ charts, publicId, name }: AssetChartsProps) => {
  if (!charts || charts.length === 0) return null;

  return (
    <div className="bg-gray-300 m-2 p-2 flex">
      <div>
        <Link href={`/investing/Chart/ListCharts/${publicId}/${name}`}>
          View
        </Link>
        <br />
        <Link href={`/investing/Chart/AddCharts/${publicId}/${name}`}>Add</Link>
      </div>
      {charts.map((path, index) => (
        <div key={index} className="flex-none w-1/3 px-4 mb-4 flex flex-col">
          <p className="flex-grow">{path.name}</p>
          <p className="flex-grow">{path.description}</p>
          <div className="w-full h-64 relative">
            <a href={path.chartsPath} target="_blank" rel="noopener noreferrer">
              <Image
                src={path.chartsPath}
                alt={`Chart ${index}`}
                layout="fill"
                objectFit="cover"
              />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssetCharts;
