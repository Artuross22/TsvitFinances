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
    [x: string]: any;
    name: string;
    riskManagement: RiskManagement | null;
};

export type RiskManagement = {
    id: number;
    publicId: string;
    name: string;
    category: RiskCategory;
    positionManagement: PositionManagement;
    baseRiskPercentage: number;
    riskToRewardRatio: number;
    hedgeId: number;
    hedge: Hedge | null;
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

export type Diversification = {
    name: string;
};

export type Hedge = {
    name: string;
};


