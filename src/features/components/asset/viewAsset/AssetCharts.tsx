"use client";
import Link from "next/link";
import Image from "next/image";
import { ViewChart } from "@/types/assetsDto";

interface AssetChartsProps {
  charts: ViewChart[];
  publicId: string;
  name: string;
}

const ShowCharts = ({ charts, publicId, name }: AssetChartsProps) => {
  return (
    <div className="bg-gray-300 m-2 p-2 flex">
      <div>
        {charts && charts.length > 0 && (
          <Link
            href={`/positionEntryNotes/ListPositionEntry/${publicId}/${name}`}
          >
            View
          </Link>
        )}
        <br />
        <Link href={`/positionEntryNotes/AddCharts/${publicId}/${name}`}>
          Add
        </Link>
      </div>

      <div className="overflow-x-auto flex">
        {charts.map((path, index) => (
          <div key={index} className="flex-none w-1/3 px-4 mb-4 flex flex-col">
            <p className="flex-grow">{path.name}</p>
            <div className="w-full h-64 relative">
              <a
                href={path.chartsPath}
                target="_blank"
                rel="noopener noreferrer"
              >
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
    </div>
  );
};

export default ShowCharts;
