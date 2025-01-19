"use client";

import BackLink from "@/features/components/useful/BackLink";
import { listInvestmentIdeas } from "@/utils/strategy";
import { UUID } from "crypto";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface ListInvestmentIdeas {
    publicId: UUID;
    name: string;
    createdAt: Date;
}

export const List = () => {
    const [investmentIdeas, setInvestmentIdeas] = useState<ListInvestmentIdeas[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInvestmentIdeas = async () => {
            try {
                const data = await listInvestmentIdeas();
                setInvestmentIdeas(data || []);
            } catch (err) {
                setError("Failed to fetch investment ideas.");
            } finally {
                setLoading(false);
            }
        };

        fetchInvestmentIdeas();
    }, []);

    if (loading) {
        return <p>Loading investment ideas...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <div className="flex bg-gray-200 justify-center mt-2 px-2">
                <BackLink />

                <Link
                    href={`/InvestmentIdea/Add`}
                    className="absolute right-1 text-green"
                    >
                    Create
             </Link>
       
            </div>
            <p>Failing to plan is planning to fail.</p>
            <ul>
                {investmentIdeas.map((idea) => (
                    <li key={idea.publicId}>
                        <h2>{idea.name}</h2>
                        <p>Created at: {new Date(idea.createdAt).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;