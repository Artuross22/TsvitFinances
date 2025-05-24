"use client";

import { useEffect, useState } from "react";
import { ViewMacroeconomic, EconomicType } from "@/types/macroeconomic";
import { macroeconomicView } from "@/api/macroeconomic";
import { useRouter } from "next/navigation";
import BackLink from "@/features/components/useful/BackLink";
import Link from "next/link";

export default function MacroeconomicView() {
    const [macroeconomicData, setMacroeconomicData] = useState<ViewMacroeconomic>();
    const [loading, setLoading] = useState(true);
    const [economicType, setEconomicType] = useState<EconomicType>(EconomicType.Positive);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await macroeconomicView(economicType);
                if(!data) {
                    router.push("/macroeconomic/add");
                }
                setMacroeconomicData(data!);
            } catch (error) {
                console.error("Error fetching macroeconomic data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [economicType, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <> 
        <div className="flex bg-gray-200 justify-center mt-2 px-2">
                <BackLink />
                <strong>Add Macroeconomic</strong>
             <div className="ml-auto flex space-x-12 text-green"></div>
        </div>
            <div className="container mx-auto p-4">
                <div className="flex justify-end items-center mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setEconomicType(EconomicType.Positive)}
                        className={`px-4 py-2 rounded ${
                            economicType === EconomicType.Positive
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Positive
                    </button>
                    <button
                        onClick={() => setEconomicType(EconomicType.Negative)}
                        className={`px-4 py-2 rounded ${
                            economicType === EconomicType.Negative
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Negative
                    </button>
                </div>
            </div>
            <div className="grid gap-4">
                <div className="border rounded-lg p-4 shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">{macroeconomicData!.title}</h2>
                    <p className="text-gray-600 mb-2">{macroeconomicData!.description}</p>
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Economic Type:</span>
                        <span className={`px-2 py-1 rounded ${
                            macroeconomicData!.economicType === EconomicType.Positive 
                                ? "bg-green-100 text-green-800"
                                : macroeconomicData!.economicType === EconomicType.Negative
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}>
                            {EconomicType[macroeconomicData!.economicType]}
                        </span>
                    </div>

                    <div className="flex justify-end">
                        <Link href={`/macroeconomic/event/add/${macroeconomicData!.publicId}`}>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
                                Add Event
                            </button>
                        </Link>
                    </div>

                    {macroeconomicData!.macroeconomicEvents && macroeconomicData!.macroeconomicEvents.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-medium mb-2">Related Events:</h3>
                            <div className="space-y-2">
                                {macroeconomicData!.macroeconomicEvents.map((event) => (
                                    <div key={event.publicId} className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium">{event.title}</p>
                                        <p className="text-sm text-gray-600">{event.description}</p>
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            <span>Rating: {event.rating}</span>
                                            <span>Source: {event.source}</span>
                                            <span>{new Date(event.createAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
} 