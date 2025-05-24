"use client";

import { eventPost } from "@/api/macroeconomic";
import { AddEvent } from "@/types/macroeconomic";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add New Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={event.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block mb-2">Description:</label>
                    <textarea
                        name="description"
                        value={event.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Source:</label>
                    <input
                        type="text"
                        name="source"
                        value={event.source}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2">Rating (0-10):</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="rating"
                            value={event.rating ?? ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded pr-8"
                            min="0"
                            max="10"
                            placeholder="Enter rating"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Event
                </button>
            </form>
        </div>
    );
}