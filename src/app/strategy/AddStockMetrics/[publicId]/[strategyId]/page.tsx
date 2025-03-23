"use client";

import BackLink from "@/features/components/useful/BackLink";
import { createStockMetrics } from "@/utils/strategy";
import { useState } from "react";
import { useRouter } from "next/navigation";


export interface FinanceDataStockMetrics {
  financeDataId: string;
  peRatio: number;
  operatingCashFlowPerShare: number;
  roe: number;
  pbRatio: number;
  dividendYield: number;
  debtToEquityRatio: number;
  ebit: number;
  psRatio: number;
  freeCashFlowPerShare: number;
  roa: number;
  netProfitMargin: number;
  revenueGrowth: number;
  debtRatio: number;
  freeCashFlow: number;
  netIncome: number;
  sharesOutstanding: number;
}

export interface Props
{
  params: {
    publicId: string;
    strategyId: string;
  };
}

export const AddStockMetrics = ({ params }: Props) => {
  const router = useRouter();
  const [stockMetrics, setStockMetrics] = useState<Partial<FinanceDataStockMetrics>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStockMetrics((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const processedMetrics = Object.entries(stockMetrics).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value === "" ? 0 : value,
        }),
        {} as Record<string, number | string>
      );

      const metricsToSubmit = {
        ...processedMetrics,
        financeDataId: params.publicId
      } as FinanceDataStockMetrics;
      
      await createStockMetrics(metricsToSubmit);
      setSubmitStatus({
        success: true,
        message: "Stock metrics saved successfully!",
      });
    } catch (error) {
      console.error("Error submitting stock metrics:", error);
      setSubmitStatus({
        success: false,
        message: "Failed to save stock metrics. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      // router.push(`/strategy/View/${params.strategyId}`);
    }
  };

  return (
    <div>
   
   <div className="flex bg-gray-200 justify-center mt-2">
      <div className="absolute left-4 text-green-600 hover:text-green-700">
          <BackLink />
        </div>
        <strong>Stock Metrics Entry</strong>
      </div>
      
    <div className="max-w-4xl mx-auto p-6">      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="peRatio" className="block text-sm font-medium text-gray-700 mb-1">
              P/E Ratio
            </label>
            <input
              type="number"
              step="0.01"
              id="peRatio"
              name="peRatio"
              value={stockMetrics.peRatio !== undefined ? stockMetrics.peRatio : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="operatingCashFlowPerShare" className="block text-sm font-medium text-gray-700 mb-1">
              Operating Cash Flow Per Share
            </label>
            <input
              type="number"
              step="0.01"
              id="operatingCashFlowPerShare"
              name="operatingCashFlowPerShare"
              value={stockMetrics.operatingCashFlowPerShare !== undefined ? stockMetrics.operatingCashFlowPerShare : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roe" className="block text-sm font-medium text-gray-700 mb-1">
              ROE
            </label>
            <input
              type="number"
              step="0.01"
              id="roe"
              name="roe"
              value={stockMetrics.roe !== undefined ? stockMetrics.roe : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pbRatio" className="block text-sm font-medium text-gray-700 mb-1">
              P/B Ratio
            </label>
            <input
              type="number"
              step="0.01"
              id="pbRatio"
              name="pbRatio"
              value={stockMetrics.pbRatio !== undefined ? stockMetrics.pbRatio : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dividendYield" className="block text-sm font-medium text-gray-700 mb-1">
              Dividend Yield
            </label>
            <input
              type="number"
              step="0.01"
              id="dividendYield"
              name="dividendYield"
              value={stockMetrics.dividendYield !== undefined ? stockMetrics.dividendYield : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="debtToEquityRatio" className="block text-sm font-medium text-gray-700 mb-1">
              Debt to Equity Ratio
            </label>
            <input
              type="number"
              step="0.01"
              id="debtToEquityRatio"
              name="debtToEquityRatio"
              value={stockMetrics.debtToEquityRatio !== undefined ? stockMetrics.debtToEquityRatio : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ebit" className="block text-sm font-medium text-gray-700 mb-1">
              EBIT
            </label>
            <input
              type="number"
              step="0.01"
              id="ebit"
              name="ebit"
              value={stockMetrics.ebit !== undefined ? stockMetrics.ebit : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="psRatio" className="block text-sm font-medium text-gray-700 mb-1">
              P/S Ratio
            </label>
            <input
              type="number"
              step="0.01"
              id="psRatio"
              name="psRatio"
              value={stockMetrics.psRatio !== undefined ? stockMetrics.psRatio : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="freeCashFlowPerShare" className="block text-sm font-medium text-gray-700 mb-1">
              Free Cash Flow Per Share
            </label>
            <input
              type="number"
              step="0.01"
              id="freeCashFlowPerShare"
              name="freeCashFlowPerShare"
              value={stockMetrics.freeCashFlowPerShare !== undefined ? stockMetrics.freeCashFlowPerShare : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="roa" className="block text-sm font-medium text-gray-700 mb-1">
              ROA
            </label>
            <input
              type="number"
              step="0.01"
              id="roa"
              name="roa"
              value={stockMetrics.roa !== undefined ? stockMetrics.roa : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="netProfitMargin" className="block text-sm font-medium text-gray-700 mb-1">
              Net Profit Margin
            </label>
            <input
              type="number"
              step="0.01"
              id="netProfitMargin"
              name="netProfitMargin"
              value={stockMetrics.netProfitMargin !== undefined ? stockMetrics.netProfitMargin : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="revenueGrowth" className="block text-sm font-medium text-gray-700 mb-1">
              Revenue Growth
            </label>
            <input
              type="number"
              step="0.01"
              id="revenueGrowth"
              name="revenueGrowth"
              value={stockMetrics.revenueGrowth !== undefined ? stockMetrics.revenueGrowth : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="debtRatio" className="block text-sm font-medium text-gray-700 mb-1">
              Debt Ratio
            </label>
            <input
              type="number"
              step="0.01"
              id="debtRatio"
              name="debtRatio"
              value={stockMetrics.debtRatio !== undefined ? stockMetrics.debtRatio : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="freeCashFlow" className="block text-sm font-medium text-gray-700 mb-1">
              Free Cash Flow
            </label>
            <input
              type="number"
              step="0.01"
              id="freeCashFlow"
              name="freeCashFlow"
              value={stockMetrics.freeCashFlow !== undefined ? stockMetrics.freeCashFlow : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="netIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Net Income
            </label>
            <input
              type="number"
              step="0.01"
              id="netIncome"
              name="netIncome"
              value={stockMetrics.netIncome !== undefined ? stockMetrics.netIncome : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sharesOutstanding" className="block text-sm font-medium text-gray-700 mb-1">
              Shares Outstanding
            </label>
            <input
              type="number"
              step="0.01"
              id="sharesOutstanding"
              name="sharesOutstanding"
              value={stockMetrics.sharesOutstanding !== undefined ? stockMetrics.sharesOutstanding : ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {submitStatus && (
          <div
            className={`p-4 ${
              submitStatus.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            } rounded-md`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Stock Metrics"}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddStockMetrics;