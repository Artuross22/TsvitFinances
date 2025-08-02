"use server";

import axios from "axios";
import { getUserId } from "./helpers/apiHelpers";
import {
  AuthStatus,
  PaperAccount,
  PlaceMarketOrder,
} from "@/types/interactiveBrokers";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const api = "https://localhost:44309/api/";

export const getPaperAccounts = async () => {
  const userId = await getUserId();
  const response = await axios.get<PaperAccount>(
    `${api}PaperTrading/GetPaperAccounts/${userId}`,
  );
  return response.data;
};

export const getAuthStatus = async () => {
  const userId = await getUserId();
  const response = await axios.get<AuthStatus>(
    `${api}IbkrAuth/GetAuthStatus/${userId}`,
  );
  console.log(response);
  return response.data;
};

export const getPaperAccountPositions = async (accountId: string) => {
  const userId = await getUserId();
  const response = await axios.get(
    `${api}PaperTrading/GetPaperAccountPositions/${userId}/${accountId}`,
  );
  return response.data;
};

export const PlaceMarketOrderPost = async (model: PlaceMarketOrder) => {
  model.userId = await getUserId();
  const response = await axios.post(`${api}PlaceMarketOrder`, model);
  return response.data;
};