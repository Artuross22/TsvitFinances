"use client";

import { UUID } from "crypto";
import { useEffect, useState } from "react";

export interface ListInvestmentIdeas {
    publicId: UUID;
    name: string;
    createdAt: Date;
}

export const RemoveBalanceFlow: React.FC = () => {
    const [investmentIdea, setInvestmentIdea] = useState<ListInvestmentIdeas[]>([]);

    useEffect(() => {
        const fetchDiversifications = async () => {
        };
    
        fetchDiversifications();
      });

    return (
        <>
        <p>Failing to plan is planning to fail.</p>;
        </>
    );
}

export default RemoveBalanceFlow;