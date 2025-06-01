export enum TimeFrame {
    None = 0,
    M5 = 1,
    M30 = 2,
    H1 = 3,
    D1 = 4,
    W = 5,
  }
  
  export interface PositionRule {
    id: number; 
    publicId: string;
    minimumCorrectionPercent: number;
    timeFrame: TimeFrame;
  }
  
  export interface PositionRuleBinding {
    publicId: string;
    positionRules: PositionRule[];
  }