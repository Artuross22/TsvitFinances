"use client";

import { useEffect, useState } from "react";
import { ViewMacroeconomic, EconomicType } from "@/types/macroeconomic";
import { macroeconomicView } from "@/api/macroeconomic";

export default function MacroeconomicView() {
    const [macroeconomicData, setMacroeconomicData] = useState<ViewMacroeconomic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await macroeconomicView();
                setMacroeconomicData(data);
            } catch (error) {
                console.error("Error fetching macroeconomic data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Macroeconomic Events</h1>
            <div className="grid gap-4">
                {macroeconomicData.map((item) => (
                    <div key={item.PublicId} className="border rounded-lg p-4 shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">{item.Title}</h2>
                        <p className="text-gray-600 mb-2">{item.Description}</p>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Economic Type:</span>
                            <span className={`px-2 py-1 rounded ${
                                item.EconomicType === EconomicType.Positive 
                                    ? "bg-green-100 text-green-800"
                                    : item.EconomicType === EconomicType.Negative
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}>
                                {EconomicType[item.EconomicType]}
                            </span>
                        </div>
                        {item.MacroeconomicEvents && item.MacroeconomicEvents.length > 0 && (
                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Related Events:</h3>
                                <div className="space-y-2">
                                    {item.MacroeconomicEvents.map((event) => (
                                        <div key={event.PublicId} className="bg-gray-50 p-3 rounded">
                                            <p className="font-medium">{event.Title}</p>
                                            <p className="text-sm text-gray-600">{event.Description}</p>
                                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                                <span>Rating: {event.Rating}</span>
                                                <span>Source: {event.Source}</span>
                                                <span>{new Date(event.CreateAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 