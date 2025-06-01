"use client";

import { positionRuleGet, positionRulePost } from "@/api/strategy";
import { PositionRuleBinding, TimeFrame, PositionRule } from "@/types/positionRule";
import { useEffect, useState } from "react";
import BackLink from "@/features/components/useful/BackLink";

interface Props {
    params: {
      publicId: string;
    };
  }

export const Page = ({params} : Props) => {
    const [positionRule, setPositionRule] = useState<PositionRuleBinding>({
        publicId: params.publicId,
        positionRules: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPositionRule = async () => {
            try {
                setIsLoading(true);
                const data = await positionRuleGet(params.publicId);
                if (data) {
                    setPositionRule(data);
                }
            } catch (err) {
                setError("Failed to load position rule data");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchPositionRule();
    }, [params.publicId]);

    const handleSubmit = async () => {
        if (!positionRule) return;
        
        const invalidRules = positionRule.positionRules.some(rule => 
            rule.minimumCorrectionPercent <= 0 || rule.timeFrame === TimeFrame.None
        );

        if (invalidRules) {
            setError("All rules must have a minimum correction percent greater than 0 and a valid time frame");
            return;
        }
        
        try {
            setIsSaving(true);
            setError(null);
            positionRule.publicId = params.publicId;
            await positionRulePost(positionRule);
        } catch (err) {
            setError("Failed to update position rule");
        } finally {
            setIsSaving(false);
        }
    };

    const addNewRule = () => {
        const newRule: PositionRule = {
            id: 0,
            publicId: "",
            minimumCorrectionPercent: 0,
            timeFrame: TimeFrame.None
        };
        setPositionRule({
            ...positionRule,
            positionRules: [...positionRule.positionRules, newRule]
        });
    };

    const removeRule = (index: number) => {
        const newRules = positionRule.positionRules.filter((_, i) => i !== index);
        setPositionRule({
            ...positionRule,
            positionRules: newRules
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">        
            <div className="flex bg-gray-200 justify-center mt-2">
                <div className="absolute left-4 text-green-600 hover:text-green-700">
                <BackLink />
            </div>
        <strong>Position Rule</strong>
      </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Edit Position Rule</h2>
                        <button
                            onClick={addNewRule}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Rule
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {positionRule.positionRules.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No position rules</h3>
                                <p className="mt-1 text-sm text-gray-500">Get started by adding a new position rule.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {positionRule.positionRules.map((rule, index) => (
                                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 relative hover:border-gray-300 transition-colors">
                                        <button
                                            onClick={() => removeRule(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Correction Percent</label>
                                                <div className="relative rounded-md shadow-sm">
                                                    <input
                                                        type="number"
                                                        value={rule.minimumCorrectionPercent}
                                                        onChange={(e) => {
                                                            const newRules = [...positionRule.positionRules];
                                                            newRules[index] = {...rule, minimumCorrectionPercent: parseFloat(e.target.value)};
                                                            setPositionRule({...positionRule, positionRules: newRules});
                                                        }}
                                                        className="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                        placeholder="Enter percentage"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
                                                <select
                                                    value={rule.timeFrame}
                                                    onChange={(e) => {
                                                        const newRules = [...positionRule.positionRules];
                                                        newRules[index] = {...rule, timeFrame: parseInt(e.target.value)};
                                                        setPositionRule({...positionRule, positionRules: newRules});
                                                    }}
                                                    className="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                                >
                                                    {Object.entries(TimeFrame)
                                                        .filter(([key]) => isNaN(Number(key)))
                                                        .filter(([_, value]) => {
                                                            return value === rule.timeFrame || 
                                                                   !positionRule.positionRules.some(r => r.timeFrame === value);
                                                        })
                                                        .map(([key, value]) => (
                                                            <option key={key} value={value}>
                                                                {key}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;