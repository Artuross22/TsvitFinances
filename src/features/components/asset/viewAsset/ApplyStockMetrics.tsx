"use client";

import { applyStockMetrics as GetStockMetrics } from "@/utils/strategy";
import { useEffect, useState } from "react";

export interface ApplyStockMetricsModel {
    financeDataId: string;
    symbol: string;
    date: string;
    debtRatio: number;
    recommendedDebtRatio: number;
    pSRatio: number;
    recommendedPSRatio: number;
    pBRatio: number;
    recommendedPBRatio: number;
    pERatio: number;
    recommendedPERatio: number;
    rOA: number;
    recommendedROA: number;
    rOE: number;
    recommendedROE: number;
    eBIT: number;
    recommendedEBIT: number;
    freeCashFlow: number;
    recommendedFreeCashFlow: number;
    netIncome: number;
    recommendedNetIncome: number;
    netProfitMargin: number;
    recommendedNetProfitMargin: number;
    dividendYield: number;
    recommendedDividendYield: number;
    revenueGrowth: number;
    recommendedRevenueGrowth: number;
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
    symbol: string;
}

const Page = ({ strategyPublicId, symbol }: Props) => {
    const [metrics, setMetrics] = useState<ApplyStockMetricsModel | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                setLoading(true);
                const data = await GetStockMetrics(strategyPublicId, symbol);
                setMetrics(data);
            } catch (error) {
                console.error("Error fetching metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, [strategyPublicId, symbol]);

    const safeToFixed = (value: number | undefined) => {
        return value !== undefined && !isNaN(value) ? value.toFixed(2) : '-';
    };

    if (loading) return <div>Loading...</div>;
    if (!metrics) return <div>No data available</div>;

    return (
        <div>
            <h1>{metrics.symbol} Stock Metrics</h1>
            <p>Date: {metrics.date}</p>

            <table>
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Current</th>
                        <th>Recommended</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Debt Ratio</td>
                        <td>{safeToFixed(metrics.debtRatio)}</td>
                        <td>{safeToFixed(metrics.recommendedDebtRatio)}</td>
                    </tr>
                    <tr>
                        <td>P/S Ratio</td>
                        <td>{safeToFixed(metrics.pSRatio)}</td>
                        <td>{safeToFixed(metrics.recommendedPSRatio)}</td>
                    </tr>
                    <tr>
                        <td>P/B Ratio</td>
                        <td>{safeToFixed(metrics.pBRatio)}</td>
                        <td>{safeToFixed(metrics.recommendedPBRatio)}</td>
                    </tr>
                    <tr>
                        <td>P/E Ratio</td>
                        <td>{safeToFixed(metrics.pERatio)}</td>
                        <td>{safeToFixed(metrics.recommendedPERatio)}</td>
                    </tr>
                    <tr>
                        <td>ROA</td>
                        <td>{safeToFixed(metrics.rOA)}%</td>
                        <td>{safeToFixed(metrics.recommendedROA)}%</td>
                    </tr>
                    <tr>
                        <td>ROE</td>
                        <td>{safeToFixed(metrics.rOE)}%</td>
                        <td>{safeToFixed(metrics.recommendedROE)}%</td>
                    </tr>
                    <tr>
                        <td>EBIT</td>
                        <td>{safeToFixed(metrics.eBIT)}</td>
                        <td>{safeToFixed(metrics.recommendedEBIT)}</td>
                    </tr>
                    <tr>
                        <td>Free Cash Flow</td>
                        <td>{safeToFixed(metrics.freeCashFlow)}</td>
                        <td>{safeToFixed(metrics.recommendedFreeCashFlow)}</td>
                    </tr>
                    <tr>
                        <td>Net Income</td>
                        <td>{safeToFixed(metrics.netIncome)}</td>
                        <td>{safeToFixed(metrics.recommendedNetIncome)}</td>
                    </tr>
                    <tr>
                        <td>Net Profit Margin</td>
                        <td>{safeToFixed(metrics.netProfitMargin)}%</td>
                        <td>{safeToFixed(metrics.recommendedNetProfitMargin)}%</td>
                    </tr>
                    <tr>
                        <td>Dividend Yield</td>
                        <td>{safeToFixed(metrics.dividendYield)}%</td>
                        <td>{safeToFixed(metrics.recommendedDividendYield)}%</td>
                    </tr>
                    <tr>
                        <td>Revenue Growth</td>
                        <td>{safeToFixed(metrics.revenueGrowth)}%</td>
                        <td>{safeToFixed(metrics.recommendedRevenueGrowth)}%</td>
                    </tr>
                    <tr>
                        <td>Shares Outstanding</td>
                        <td>{safeToFixed(metrics.sharesOutstanding)}</td>
                        <td>{safeToFixed(metrics.recommendedSharesOutstanding)}</td>
                    </tr>
                    <tr>
                        <td>Debt to Equity Ratio</td>
                        <td>{safeToFixed(metrics.debtToEquityRatio)}</td>
                        <td>{safeToFixed(metrics.recommendedDebtToEquityRatio)}</td>
                    </tr>
                    <tr>
                        <td>Free Cash Flow Per Share</td>
                        <td>{safeToFixed(metrics.freeCashFlowPerShare)}</td>
                        <td>{safeToFixed(metrics.recommendedFreeCashFlowPerShare)}</td>
                    </tr>
                    <tr>
                        <td>Operating Cash Flow Per Share</td>
                        <td>{safeToFixed(metrics.operatingCashFlowPerShare)}</td>
                        <td>{safeToFixed(metrics.recommendedOperatingCashFlowPerShare)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Page;
