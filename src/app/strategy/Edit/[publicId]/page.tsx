"use client";

import { editStrategyGet, editStrategyPost } from "@/api/strategy";
import { EditStrategy, MacroeconomicEvents } from "@/types/strategy";
import { useEffect, useState } from "react";
import { EconomicType } from "@/types/macroeconomic";
import BackLink from "@/features/components/useful/BackLink";
import { useRouter } from "next/navigation";

interface Props {
    params: {
      publicId: string;
    };
}

export default function Page({ params }: Props) {
    const [strategy, setStrategy] = useState<EditStrategy>();
    const router = useRouter();

    useEffect(() => {
        const fetchStrategy = async () => {
            const data = await editStrategyGet(params.publicId);
            setStrategy(data);
        };
    
        fetchStrategy();
    }, [params.publicId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (strategy) {
            try {
                await editStrategyPost(strategy);
                router.push(`/strategy/View/${params.publicId}`);
            } catch (error) {
                console.error("Error updating strategy:", error);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setStrategy(prev => prev ? {
            ...prev,
            [name]: value
        } : undefined);
    };

    const handleEventToggle = (event: MacroeconomicEvents) => {
        if (!strategy) return;

        const updatedEvents = strategy.macroeconomicEvents.map(e => 
            e.id === event.id 
                ? { ...e, isSelected: !e.isSelected }
                : e
        );

        setStrategy({
            ...strategy,
            macroeconomicEvents: updatedEvents
        });
    };

    if (!strategy) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    return (
        <>
            <div className="flex bg-gray-200 justify-center mt-2 px-2">
                <BackLink />
                <strong>Edit Strategy</strong>
                <div className="ml-auto flex space-x-12 text-green"></div>
            </div>
            <div className="max-w-4xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Strategy Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={strategy.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={strategy.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Macroeconomic Events
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-medium text-green-700">Positive Events</h3>
                                {strategy.macroeconomicEvents
                                    .filter(event => event.economicType === EconomicType.Positive)
                                    .map((event) => (
                                        <div key={event.publicId} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id={`event-${event.publicId}`}
                                                checked={event.isSelected}
                                                onChange={() => handleEventToggle(event)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor={`event-${event.publicId}`}
                                                className="flex items-center space-x-2"
                                            >
                                                <span className="text-sm text-gray-900">{event.title}</span>
                                                <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                                                    {EconomicType[event.economicType]}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium text-red-700">Negative Events</h3>
                                {strategy.macroeconomicEvents
                                    .filter(event => event.economicType === EconomicType.Negative)
                                    .map((event) => (
                                        <div key={event.publicId} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                id={`event-${event.publicId}`}
                                                checked={event.isSelected}
                                                onChange={() => handleEventToggle(event)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor={`event-${event.publicId}`}
                                                className="flex items-center space-x-2"
                                            >
                                                <span className="text-sm text-gray-900">{event.title}</span>
                                                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                                                    {EconomicType[event.economicType]}
                                                </span>
                                            </label>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
