"use client";

import { applaStrategy } from "@/utils/strategy";
import { UUID } from "crypto";
import { useEffect, useState } from "react";

interface Props {
    publicId: UUID;
  }

export interface InputModel {
    position: _Position;
    risk: _Risk;
}

export interface Diversification {
    totalNicheSum: number;
    recommendedNichePercentage: number;
    sector: String;
    total: number;
}

export interface Range {
    start?: number | null;
    end: number;
}

export interface TargetLevels {
    level: number;
    averageLevel?: number | null;
}

export interface _Position {
    buyTargets: Range[];
    sellTargets: Range[];
}

export interface _Risk {
    baseRisk: number;
    riskToReward: number;
    diversifications: Diversification[];
}

  const AssetTargets = ({publicId }: Props) => {

    const [strategy, setStrategies] = useState<InputModel>([]);

    useEffect(() => {
      const fetchAssets = async () => {
        const fetchedAssets = await applaStrategy(publicId);
        setStrategies(fetchedAssets);
      };
  
      fetchAssets();
    }, []);
  
    return (
        <div className="bg-gray-300 m-2 p-2"> 
   
        </div>
    );
  };
  export default AssetTargets;