"use client";

import { applyStockMetrics as GetStockMetrics } from "@/utils/strategy";
import { useEffect, useState } from "react";

export interface ApplyStockMetricsModel {
    financeDataId: string;
    symbol: string;
    date: string;
    debtRatio: number;
    recommendedDebtRatio: number;
    psRatio: number;
    recommendedPSRatio: number;
    pbRatio: number;
    recommendedPBRatio: number;
    peRatio: number;
    recommendedPERatio: number;
    roa: number;
    recommendedROA: number;
    roe: number;
    recommendedROE: number;
    ebit: number;
    recommendedEBIT: number;
    freeCashFlow: number;
    recommendedFreeCashFlow: number;
    netIncome: number;
    recommendedNetIncome: number;
    netProfitMargin: number;
    recommendedNetProfitMargin: number;
    dividendYield: number;
    recommendedDividendYield: number;
    sharesOutstanding: number;
    recommendedSharesOutstanding: number;
    debtToEquityRatio: number;
    recommendedDebtToEquityRatio: number;
    freeCashFlowPerShare: number;
    recommendedFreeCashFlowPerShare: number;
    operatingCashFlowPerShare: number;
    recommendedOperatingCashFlowPerShare: number;
}

export interface Props {
    strategyPublicId: string;
    assetPublicId: string;
}

const StockMetricsPage = ({ strategyPublicId, assetPublicId }: Props) => {
    const [metrics, setMetrics] = useState<ApplyStockMetricsModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await GetStockMetrics(strategyPublicId, assetPublicId);
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [strategyPublicId, assetPublicId]);

    const safeToFixed = (value: number | undefined, decimals: number = 2) => {
        return value !== undefined && !isNaN(value) ? value.toFixed(decimals) : '-';
    };

    const renderMetricRow = (
        label: string, 
        currentValue: number | undefined, 
        recommendedValue: number | undefined, 
        percentage: boolean = false
    ) => (
        <tr key={label} className="border-b hover:bg-gray-50 transition-colors">
            <td className="px-4 py-2 font-medium text-gray-900">{label}</td>
            <td className="px-4 py-2 text-right">
                {safeToFixed(currentValue)}{percentage ? '%' : ''}
            </td>
            <td className="px-4 py-2 text-right">
                {safeToFixed(recommendedValue)}{percentage ? '%' : ''}
            </td>
        </tr>
    );

    if (loading) return <div className="text-center py-4 text-gray-600">Loading...</div>;
    if (!metrics) return <div className="text-center py-4 text-gray-600">No data available</div>;

    return (
        <div className="bg-gray-100 rounded-lg shadow-md p-4 max-w-4xl mx-auto my-8">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {metrics.symbol} Stock Metrics
                </h1>
                <p className="text-sm text-gray-600">
                    Date: {metrics.date}
                </p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Metric</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Current</th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700">Recommended</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderMetricRow("Debt Ratio", metrics.debtRatio, metrics.recommendedDebtRatio)}
                        {renderMetricRow("P/S Ratio", metrics.psRatio, metrics.recommendedPSRatio)}
                        {renderMetricRow("P/B Ratio", metrics.pbRatio, metrics.recommendedPBRatio)}
                        {renderMetricRow("P/E Ratio", metrics.peRatio, metrics.recommendedPERatio)}
                        {renderMetricRow("ROA", metrics.roa, metrics.recommendedROA, true)}
                        {renderMetricRow("ROE", metrics.roe, metrics.recommendedROE, true)}
                        {renderMetricRow("EBIT", metrics.ebit, metrics.recommendedEBIT)}
                        {renderMetricRow("Free Cash Flow", metrics.freeCashFlow, metrics.recommendedFreeCashFlow)}
                        {renderMetricRow("Net Income", metrics.netIncome, metrics.recommendedNetIncome)}
                        {renderMetricRow("Net Profit Margin", metrics.netProfitMargin, metrics.recommendedNetProfitMargin, true)}
                        {renderMetricRow("Dividend Yield", metrics.dividendYield, metrics.recommendedDividendYield, true)}
                        {renderMetricRow("Shares Outstanding", metrics.sharesOutstanding, metrics.recommendedSharesOutstanding)}
                        {renderMetricRow("Debt to Equity Ratio", metrics.debtToEquityRatio, metrics.recommendedDebtToEquityRatio)}
                        {renderMetricRow("Free Cash Flow Per Share", metrics.freeCashFlowPerShare, metrics.recommendedFreeCashFlowPerShare)}
                        {renderMetricRow("Operating Cash Flow Per Share", metrics.operatingCashFlowPerShare, metrics.recommendedOperatingCashFlowPerShare)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockMetricsPage;