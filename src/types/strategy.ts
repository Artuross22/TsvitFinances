export type AddStragy = {
    id: number;
    publicId: string;
    userPublicId: string;
    name: string;
};

export type RiskManagement = {
    id: number;
    publicId: string;
    name: string;
    category: RiskCategory;
    baseRiskPercentage: number;
    riskToRewardRatio: number;
    hedgeId: number;
    hedge: Hedge;
};

export type PositionManagement = {
    id: number;
    scalingOut: number | null;
    scalingIn: number | null;
    averageLevel: number;
};

export type RiskCategory = {
    name: string;
};

export type Hedge = {
    name: string;
};