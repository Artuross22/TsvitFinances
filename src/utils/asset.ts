"use server";

import { Asset, InvestmentTerm, Market, Sector } from "@/types/asset";
import { redirect } from "next/navigation";
import axios from "axios";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";
import { EditAssetDto } from "@/app/investing/EditAsset/[id]/page";
import { ViewAssetDto } from "@/features/components/asset/viewAsset/AssetDetails";
import { AddTarget } from "@/app/investing/Target/addTargets/[assetPublicId]/page";
import { EditTarget } from "@/app/investing/Target/editTarget/[publicId]/[name]/page";
import {
  PositionEntryModel,
  UpdateChart,
  UpdateNote,
} from "@/app/positionEntryNotes/ListPositionEntry/[id]/[name]/page";
import { ListCharts } from "@/types/assetsDto";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const checkverify = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("jwtToken")!.value;

  return await verifyAuth(token);
};

const api = "https://localhost:44309/api/";

export interface AssetOptions {
  sectors: Sector[];
  markets: Market[];
  investmentTerms: InvestmentTerm[];
}

export const editTargetGet = async (
  publicId: string,
  levelName: string,
): Promise<EditTarget> => {
  const res = await axios.get(`${api}EditTarget/${publicId}/${levelName}`);
  return res.data;
};

export const editTargetPost = async (model: EditTarget): Promise<boolean> => {
  const res = await axios.post(`${api}EditTarget`, model);
  return res.status === 200;
};

export const addTargets = async (model: AddTarget): Promise<boolean> => {
  const res = await axios.post(`${api}AddTargets`, model);
  return res.status === 200;
};

export const createAssetGet = async (): Promise<AssetOptions> => {
  try {
    const res = await axios.get(`${api}AddAssets`);
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
  formData.append(
    "userPublicId",
    await checkverify().then((data) => data.userPublicId!),
  );

  var token = await checkverify().then((data) => data.jti);
  const response = await axios.post<Asset>(`${api}AddAssets`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    redirect(`/investing`);
  } else {
    redirect("/");
  }
}

export const getAllAssets = async (): Promise<Asset[]> => {
  try {
    var token = await checkverify().then((data) => data.jti);
    const response = await axios.get<Asset[]>(`${api}ListAssets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getAsset = async (id: string): Promise<ViewAssetDto> => {
  try {
    const response = await axios.get(`${api}ViewAsset/${id}`);
    const data = response.data;
    return data as ViewAssetDto;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCharts = async (id: string): Promise<PositionEntryModel> => {
  try {
    const response = await axios.get(`${api}PositionEntryByAsset/${id}`);
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
    const response = await axios.delete(`${api}DeleteCharts/${id}/${assetId}`);
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
      `${api}DeletePositionEntry/${publicId}`,
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateNote = async (updateNote: UpdateNote): Promise<boolean> => {
  try {
    const response = await axios.put<boolean>(`${api}UpdateNotes`, updateNote);
    return response.status === 200;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const addChartToNote = async (formData: FormData): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(
      `${api}AddChartToPositionEntry`,
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
    const response = await axios.post<boolean>(`${api}AddCharts`, formData, {
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
    const response = await axios.put<boolean>(`${api}UpdateCharts`, model);

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
    const response = await axios.get(`${api}UpdateAssets/${id}`);
    const data = response.data;
    return data as EditAssetDto;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editAsset = async (asset: EditAssetDto): Promise<void> => {
  asset.userPublicId = await checkverify().then((data) => data.userPublicId!);

  const response = await axios.put<EditAssetDto>(`${api}UpdateAssets`, asset);

  if (response.status === 200) {
    redirect(`/investing/ViewAsset/${asset.publicId}`);
  } else {
    redirect("/");
  }
};

export const deleteAsset = async (root: string, id: string) => {
  let response;

  if (root === "deleteAsset") {
    response = await axios.delete(`${api}DeleteAssets/${id}`);
  } else if (root === "sellAsset") {
    response = await axios.post(`${api}SellAssets/${id}`);
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
