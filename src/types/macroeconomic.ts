export enum EconomicType {
    None = 0,
    Positive,
    Negative,
}

export interface MacroeconomicPost {
    userId: string;
    title: string;
    description: string;
    economicType: EconomicType;
}

export interface MacroeconomicEvent {
    publicId: string;
    title: string;
    description: string;
    rating: number;
    createAt: Date;
    source: string;
}

export interface ViewMacroeconomic {
    publicId: string;
    title: string;
    description: string;
    economicType: EconomicType;
    macroeconomicEvents?: ReadonlyArray<MacroeconomicEvent>;
}