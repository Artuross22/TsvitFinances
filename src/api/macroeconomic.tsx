"use server";

import axios from "axios";
import { getUserId } from "./helpers/apiHelpers";
import { MacroeconomicPost as MacroeconomicCreate, ViewMacroeconomic, EconomicType, AddEvent } from "@/types/macroeconomic";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const api = "https://localhost:44309/api/";

export const macroeconomicPost = async (model: MacroeconomicCreate) => {
    model.userId = await getUserId();
    const response = await axios.post(`${api}CreateMacroeconomic`, model);
    return response.data;
}

export const macroeconomicView = async (type : EconomicType) => {
        const userId = await getUserId();
        const response = await axios.get<ViewMacroeconomic>(`${api}ViewMacroeconomic?userId=${userId}&type=${type}`);
        return response.data;
}

export const eventPost = async (event : AddEvent) => {
    const response = await axios.post<AddEvent>(`${api}CreateMacroeconomicEvent`, event);
    return response.data;
}