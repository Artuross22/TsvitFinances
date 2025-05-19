export enum EconomicType {
    None = 0,
    Positive,
    Negative,
}

export interface MacroeconomicPost {
    UserId: string;
    Title: string;
    Description: string;
    EconomicType: EconomicType;
}

export interface MacroeconomicEvent {
    PublicId: string;
    Title: string;
    Description: string;
    Rating: number;
    CreateAt: Date;
    Source: string;
}

export interface ViewMacroeconomic {
    PublicId: string;
    Title: string;
    Description: string;
    EconomicType: EconomicType;
    MacroeconomicEvents?: ReadonlyArray<MacroeconomicEvent>;
}