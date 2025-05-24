"use client";

import { eventPost } from "@/api/macroeconomic";
import { AddEvent } from "@/types/macroeconomic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BackLink from "@/features/components/useful/BackLink";

interface Props {
    params: {
      publicId: string;
    };
  }

export default function Page({ params }: Props) {
    const router = useRouter();
    const [event, setEvent] = useState<AddEvent>({
        macroeconomicAnalysisId: params.publicId,
        title: "",
        description: "",
        source: "",
        rating: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEvent(prev => ({
            ...prev,
            [name]: name === "rating" ? (value === "" ? null : Number(value)) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await eventPost(event);
            router.push("/macroeconomic");
        } catch (error) {
            console.error("Error adding event:", error);
        }
    };

    return (
        <> 
        <div className="flex bg-gray-200 justify-center mt-2 px-2">
                <BackLink />
                <strong>Add Event</strong>
             <div className="ml-auto flex space-x-12 text-green"></div>
        </div>
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={event.title}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Description:</label>
                        <textarea
                            name="description"
                            value={event.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[120px]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Source:</label>
                        <input
                            type="text"
                            name="source"
                            value={event.source}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-gray-700 font-medium">Rating (0-10):</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="rating"
                                value={event.rating ?? ""}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                min="0"
                                max="10"
                                placeholder="Enter rating"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Add Event
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}