"use client";

import { macroeconomicPost } from "@/api/macroeconomic";
import { EconomicType, MacroeconomicPost } from "@/types/macroeconomic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackLink from "@/features/components/useful/BackLink";

export default function AddMacroeconomic() {
    const router = useRouter();
    const [formData, setFormData] = useState<MacroeconomicPost>({
        userId: "",
        title: "",
        description: "",
        economicType: EconomicType.Positive
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await macroeconomicPost(formData);
            router.push("/macroeconomic");
        } catch (error) {
            console.error("Error creating macroeconomic post:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "economicType" ? parseInt(value) : value
        }));
    };

    return (
        <>
        <div className="flex bg-gray-200 justify-center mt-2 px-2">
            <BackLink />
            <strong>Add Macroeconomic</strong>
        <div className="ml-auto flex space-x-12 text-green"></div>
        </div>
        <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="form-group">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={4}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="economicType" className="block text-sm font-medium text-gray-700 mb-1">
                        Economic Type
                    </label>
                    <select
                        id="economicType"
                        name="economicType"
                        value={formData.economicType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value={EconomicType.Positive}>Positive</option>
                        <option value={EconomicType.Negative}>Negative</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                    Create Post
                </button>
            </form>
        </div>
        </>
    );
}