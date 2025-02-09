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
    <div className="bg-gray-100 rounded-lg shadow-md p-4 max-w-4xl mx-auto my-8">
      <div className="flex items-center space-x-4 mb-4">
        <div>
          {charts && charts.length > 0 && (
            <Link
              href={`/positionEntryNotes/ListPositionEntry/${publicId}/${name}`}
              className="block mb-2 text-blue-600 hover:text-blue-800"
            >
              View
            </Link>
          )}
          <Link 
            href={`/positionEntryNotes/AddCharts/${publicId}/${name}`}
            className="block text-blue-600 hover:text-blue-800"
          >
            Add
          </Link>
        </div>

        <div className="overflow-x-auto flex-1">
          <div className="flex">
            {charts.map((path, index) => (
              <div key={index} className="flex-none w-80 px-4 mb-4">
                <p className="mb-2 font-medium text-gray-800 truncate">
                  {path.name}
                </p>
                <div className="relative w-full h-48">
                  <a
                    href={path.chartsPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <Image
                      src={path.chartsPath}
                      alt={`Chart ${index + 1}`}
                      sizes="320px"
                      priority={index < 3}
                      quality={75}
                      className="object-contain hover:opacity-90 transition-opacity"
                      fill
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCharts;