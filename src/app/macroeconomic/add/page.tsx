"use client";

import { macroeconomicPost } from "@/api/macroeconomic";
import { EconomicType, MacroeconomicPost } from "@/types/macroeconomic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackLink from "@/features/components/useful/BackLink";

export default function AddMacroeconomic() {
    const router = useRouter();
    const [formData, setFormData] = useState<MacroeconomicPost>({
        UserId: "",
        Title: "",
        Description: "",
        EconomicType: EconomicType.Positive
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
            [name]: name === "EconomicType" ? parseInt(value) : value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex bg-gray-200 justify-center mt-2">
                <div className="absolute left-4 text-green-600 hover:text-green-700">
                    <BackLink />
                </div>
                <strong>Add Macroeconomic Post</strong>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="form-group">
                    <label htmlFor="Title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="Title"
                        name="Title"
                        value={formData.Title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="Description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="Description"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={4}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="EconomicType" className="block text-sm font-medium text-gray-700 mb-1">
                        Economic Type
                    </label>
                    <select
                        id="EconomicType"
                        name="EconomicType"
                        value={formData.EconomicType}
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
    );
}