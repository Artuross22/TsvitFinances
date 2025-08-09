import { EconomicType } from "./macroeconomic";

export enum RiskCategory {
  Invalid = 0,
  Low = 1,
  Medium,
  MediumHigh,
  High,
}

export interface EditStrategy {
  publicId: string;
  name: string;
  description: string;
  macroeconomicEvents: MacroeconomicEvents[];
}

export interface MacroeconomicEvents {
  id: number;
  publicId: string;
  title: string;
  economicType: EconomicType;
  isSelected: boolean;
}
