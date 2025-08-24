"use server";

import axios from "axios";
import { apiTsvit, getUserId } from "./helpers/apiHelpers";
import {
  AuthStatus,
  Orderlimits,
  PaperAccount,
  PlaceLimitOrder,
  PlaceMarketOrder,
} from "@/types/interactiveBrokers";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const getPaperAccounts = async () => {
  const userId = await getUserId();
  const response = await axios.get<PaperAccount>(
    `${apiTsvit}PaperTrading/GetPaperAccounts/${userId}`,
  );
  return response.data;
};

export const getAuthStatus = async () => {
  const userId = await getUserId();
  const response = await axios.get<AuthStatus>(
    `${apiTsvit}IbkrAuth/GetAuthStatus/${userId}`,
  );
  console.log(response);
  return response.data;
};

export const getPaperAccountPositions = async (accountId: string) => {
  const userId = await getUserId();
  const response = await axios.get(
    `${apiTsvit}PaperTrading/GetPaperAccountPositions/${userId}/${accountId}`,
  );
  return response.data;
};

export const PlaceMarketOrderPost = async (model: PlaceMarketOrder) => {
  model.userId = await getUserId();
  const response = await axios.post(`${apiTsvit}PlaceMarketOrder`, model);
  return response.data;
};

export const PlaceLimitOrderPost = async (model: PlaceLimitOrder) => {
  model.userId = await getUserId();
  const response = await axios.post(`${apiTsvit}PlaceLimitOrder`, model);
  return response.data;
};

export const GetOrders = async () => {
  const userId = await getUserId();
  const response = await axios.get<Orderlimits[]>(`${apiTsvit}GetLiveOrders/${userId}`);
  return response.data;
};