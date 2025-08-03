"use client";

import { useState } from "react";
import { PlaceLimitOrderPost } from "@/api/interactiveBrokers";

interface Props {
  params: {
    assetPublicId: string;
  };
}

export const PlaceLimitOrder = ({ params }: Props) => {
  const [accountId, setAccountId] = useState("");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<string>("1");
  const [price, setPrice] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await PlaceLimitOrderPost({
        accountId,
        side,
        quantity: Number(quantity),
        userId: "",
        assetPublicId: params.assetPublicId,
        price: Number(price)
      });
      setMessage("Order sent successfully!");
    } catch (err) {
      setMessage("Error while sending order");
    } finally {
      setLoading(false);
    }
  };

  const isQuantityValid = quantity !== "" && !isNaN(Number(quantity)) && Number(quantity) >= 1;

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="text-lg font-semibold text-gray-800 mb-4">Place Limit Order</div>
      <div className="text-sm text-gray-500 mb-4">Asset: {params.assetPublicId}</div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Account ID</label>
        <input
          type="text"
          value={accountId}
          onChange={e => setAccountId(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Side</label>
        <select
          value={side}
          onChange={e => setSide(e.target.value as "BUY" | "SELL")}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          min={1}
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded-md p-3 font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        disabled={loading || !accountId || !isQuantityValid}
      >
        {loading ? "Sending..." : "Send Limit Order"}
      </button>
      {message && <div className="mt-3 text-center text-sm text-blue-700">{message}</div>}
    </form>
  );
};

export default PlaceLimitOrder;