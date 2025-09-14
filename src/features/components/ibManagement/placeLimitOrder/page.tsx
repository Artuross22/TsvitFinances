"use client";

import { useState } from "react";
import { PlaceLimitOrderPost } from "@/api/interactiveBrokers";
import { type PlaceLimitOrder, PositionType } from "@/types/interactiveBrokers";

interface Props {
  params: {
    assetPublicId: string;
  };
}

export const PlaceLimitOrderComponent = ({ params }: Props) => {
  const [orderModel, setOrderModel] = useState<PlaceLimitOrder>({
    accountId: "",
    assetPublicId: params.assetPublicId,
    userId: "",
    type: PositionType.Long,
    quantity: 1,
    price: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await PlaceLimitOrderPost(orderModel);
      setMessage("Order sent successfully!");
    } catch (err) {
      setMessage("Error while sending order");
    } finally {
      setLoading(false);
    }
  };

  const isQuantityValid = orderModel.quantity >= 1;
  const isPriceValid = orderModel.price > 0;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="text-lg font-semibold text-gray-800 mb-4">Place Limit Order</div>
      <div className="text-sm text-gray-500 mb-4">Asset: {params.assetPublicId}</div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Account ID</label>
        <input
          type="text"
          value={orderModel.accountId}
          onChange={e => setOrderModel(prev => ({ ...prev, accountId: e.target.value }))}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Side</label>
        <select
          value={orderModel.type}
          onChange={e => setOrderModel(prev => ({ ...prev, type: Number(e.target.value) as PositionType }))}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value={PositionType.Long}>BUY</option>
          <option value={PositionType.Short}>SELL</option>
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          min={1}
          value={orderModel.quantity}
          onChange={e => setOrderModel(prev => ({ ...prev, quantity: Number(e.target.value) }))}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          value={orderModel.price}
          onChange={e => setOrderModel(prev => ({ ...prev, price: Number(e.target.value) }))}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md p-3 font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        disabled={loading || !orderModel.accountId || !isQuantityValid || !isPriceValid}
      >
        {loading ? "Sending..." : "Send Limit Order"}
      </button>
      {message && <div className="mt-3 text-center text-sm text-blue-700">{message}</div>}
    </form>
  );
};

export default PlaceLimitOrderComponent;