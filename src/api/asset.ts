"use server";

import { AddAssetHistory, Asset, InvestmentTerm, ListAssetHistory, Market, Sector } from "@/types/asset";
import { redirect } from "next/navigation";
import axios from "axios";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import { EditAssetDto } from "@/app/investing/EditAsset/[id]/page";
import { AddTarget } from "@/app/investing/Target/addTargets/[assetPublicId]/page";
import { EditTarget } from "@/app/investing/Target/editTarget/[publicId]/[name]/page";
import {
  PositionEntryModel,
  UpdateChart,
  UpdateNote,
} from "@/app/PositionEntryNotes/ListPositionEntry/[id]/[name]/page";
import { ListCharts } from "@/types/AssetsDto";
import { ViewAssetDto } from "@/app/investing/ViewAsset/[id]/page";
import { apiTsvit } from "./helpers/apiHelpers";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const checkverify = async () => {
  try {
    const cookieStore = cookies();
    const jwtCookie = cookieStore.get("jwtToken");
    
    if (!jwtCookie || !jwtCookie.value) {
      throw new Error("Authentication failed: No JWT token found");
    }

    return await verifyAuth(jwtCookie.value);
  } catch (error) {
    console.error("Error in checkverify:", error);
    throw error;
  }
};

export interface AssetOptions {
  sectors: Sector[];
  markets: Market[];
  investmentTerms: InvestmentTerm[];
}

export const editTargetGet = async (
  publicId: string,
  levelName: string,
): Promise<EditTarget> => {
  const res = await axios.get(`${apiTsvit}EditTarget/${publicId}/${levelName}`);
  return res.data;
};

export const editTargetPost = async (model: EditTarget): Promise<boolean> => {
  const res = await axios.post(`${apiTsvit}EditTarget`, model);
  return res.status === 200;
};

export const addTargets = async (model: AddTarget): Promise<boolean> => {
  const res = await axios.post(`${apiTsvit}AddTargets`, model);
  return res.status === 200;
};

export const createAssetGet = async (): Promise<AssetOptions> => {
  try {
    const res = await axios.get(`${apiTsvit}AddAssets`);
    const data = res.data;
    return {
      sectors: data.sectors || [],
      markets: data.markets || [],
      investmentTerms: data.investmentTerms || [],
    };
  } catch (error) {
    console.error("Error fetching asset options:", error);
    throw error;
  }
};

export async function createAssetPost(formData: FormData) {
  try {
    // Check if user is authenticated
    const authData = await checkverify();
    if (!authData || !authData.userPublicId || !authData.jti) {
      throw new Error("Authentication failed: Invalid or missing user data");
    }

    formData.append("userPublicId", authData.userPublicId);
    
    const token = authData.jti;
    const response = await axios.post<Asset>(`${apiTsvit}AddAssets`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      redirect(`/investing`);
    } else {
      redirect("/");
    }
  } catch (error) {
    console.error("Error in createAssetPost:", error);
    
    if (error instanceof Error && error.message.includes("Authentication failed")) {
      redirect("/auth/signIn");
    }
    
    redirect("/");
  }
}

export const getAllAssets = async (): Promise<Asset[]> => {
  try {
    const authData = await checkverify();
    if (!authData || !authData.jti) {
      throw new Error("Authentication failed: Invalid or missing token");
    }
    
    const token = authData.jti;
    const response = await axios.get<Asset[]>(`${apiTsvit}ListAssets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error in getAllAssets:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Authentication failed")) {
        throw new Error("Authentication failed. Please sign in again.");
      } else if (error.message.includes("Invalid token")) {
        throw new Error("Session expired. Please sign in again.");
      }
    }
    
    throw new Error("Failed to fetch assets. Please try again later.");
  }
};

export const getAsset = async (id: string): Promise<ViewAssetDto> => {
  try {
    const response = await axios.get(`${apiTsvit}ViewAsset/${id}`);
    const data = response.data;
    return data as ViewAssetDto;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCharts = async (id: string): Promise<PositionEntryModel> => {
  try {
    const response = await axios.get(`${apiTsvit}PositionEntryByAsset/${id}`);
    const data = response.data;
    return data as PositionEntryModel;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteCharts = async (
  id: string,
  assetId: string,
): Promise<ListCharts> => {
  try {
    const response = await axios.delete(`${apiTsvit}DeleteCharts/${id}/${assetId}`);
    const data = response.data;
    return data as ListCharts;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deletePositionEntry = async (
  publicId: string,
): Promise<boolean> => {
  try {
    const response = await axios.delete<boolean>(
      `${apiTsvit}DeletePositionEntry/${publicId}`,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateNote = async (updateNote: UpdateNote): Promise<boolean> => {
  try {
    const response = await axios.put<boolean>(`${apiTsvit}UpdateNotes`, updateNote);
    return response.status === 200;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addChartToNote = async (formData: FormData): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(
      `${apiTsvit}AddChartToPositionEntry`,
      formData,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addChart = async (formData: FormData): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(`${apiTsvit}AddCharts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateChart = async (model: UpdateChart): Promise<boolean> => {
  try {
    const response = await axios.put<boolean>(`${apiTsvit}UpdateCharts`, model);

    if (response.status === 200) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editAssetGet = async (id: string): Promise<EditAssetDto> => {
  try {
    const response = await axios.get(`${apiTsvit}UpdateAssets/${id}`);
    const data = response.data;
    return data as EditAssetDto;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editAsset = async (asset: EditAssetDto): Promise<void> => {
  try {
    const authData = await checkverify();
    if (!authData || !authData.userPublicId) {
      throw new Error("Authentication failed: Invalid or missing user data");
    }

    asset.userPublicId = authData.userPublicId;

    const response = await axios.put<EditAssetDto>(`${apiTsvit}UpdateAssets`, asset);

    if (response.status === 200) {
      redirect(`/investing/ViewAsset/${asset.publicId}`);
    } else {
      redirect("/");
    }
  } catch (error) {
    console.error("Error in editAsset:", error);
    
    if (error instanceof Error && error.message.includes("Authentication failed")) {
      redirect("/auth/signIn");
    }
    
    redirect("/");
  }
};

export const deleteAsset = async (root: string, id: string) => {
  let response;

  if (root === "deleteAsset") {
    response = await axios.delete(`${apiTsvit}DeleteAssets/${id}`);
  } else if (root === "sellAsset") {
    response = await axios.post(`${apiTsvit}SellAssets/${id}`);
  } else {
    throw new Error("Invalid root parameter");
  }

  if (response.status === 200) {
    redirect("/investing");
  } else {
    console.error("Unexpected response status:", response.status);
    redirect("/");
  }
};

export const addAssetHistory = async (model: AddAssetHistory) => {
  console.log("Added");
  const response = await axios.post(`${apiTsvit}AddAssetHistory`, model);
  return response.data;
};

export const listAssetHistory = async (assetPublicId: string) => {
  console.log("Hello",assetPublicId);
  const response = await axios.get<ListAssetHistory[]>(`${apiTsvit}ListAssetHistory/${assetPublicId}`);
  return response.data;
};