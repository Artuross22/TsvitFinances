"use server";

import axios from "axios";
import { apiTsvit, getUserId } from "./helpers/apiHelpers";
import {
  MacroeconomicPost as MacroeconomicCreate,
  ViewMacroeconomic,
  EconomicType,
  AddEvent,
} from "@/types/macroeconomic";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const macroeconomicPost = async (model: MacroeconomicCreate) => {
  model.userId = await getUserId();
  const response = await axios.post(`${apiTsvit}CreateMacroeconomic`, model);
  return response.data;
};

export const macroeconomicView = async (type: EconomicType) => {
  const userId = await getUserId();
  const response = await axios.get<ViewMacroeconomic>(
    `${apiTsvit}ViewMacroeconomic?userId=${userId}&type=${type}`,
  );
  return response.data;
};

export const eventPost = async (event: AddEvent) => {
  const response = await axios.post<AddEvent>(
    `${apiTsvit}CreateMacroeconomicEvent`,
    event,
  );
  return response.data;
};
