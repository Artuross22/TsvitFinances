export type AddStragy = {
  id: number;
  publicId: string;
  userPublicId: string;
  name: string;
};

export type ListStrategies = {
  publiceId: string;
  name: string;
};

export type GetStrategy = {
  name: string;
  riskManagement: RiskManagement | null;
  positionManagement: PositionManagement | null;
};

export type RiskManagement = {
  id: number;
  publicId: string;
  name: string;
  category: RiskCategory;
  baseRiskPercentage: number;
  riskToRewardRatio: number;
  hedgeId: number;
  hedge: Hedge | null;
};

export type PositionManagement = {
  id: number;
  publicId: string;
  scalingOut: number | null;
  scalingIn: number | null;
  averageLevel: number;
};

export type RiskCategory = {
  name: string;
};

export type Diversification = {
  name: string;
};

export type Hedge = {
  name: string;
};
