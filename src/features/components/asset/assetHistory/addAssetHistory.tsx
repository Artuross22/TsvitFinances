"use client";

import { listInvestmentIdeas } from "@/api/strategy";
import { UUID } from "crypto";
import { useEffect, useState } from "react";

export interface ListInvestmentIdeas {
    publicId: UUID;
    name: string;
    createdAt: Date;
}


export const List  = () => {
    const [investmentIdea, setInvestmentIdea] = useState<ListInvestmentIdeas[]>([]);

    useEffect(() => {
        const fetchDiversifications = async () => {
            const data = await listInvestmentIdeas();
            setInvestmentIdea(data);
        };
    
        fetchDiversifications();
      });

    return (
        <>
        <p>Failing to plan is planning to fail.</p>;
        </>
    );
}

export default List;