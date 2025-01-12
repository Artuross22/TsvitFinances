"use server";

import { AddStragy } from "@/app/strategy/AddStrategy/page";
import {
  AddToStrategy,
  ListStrategiesForAsset,
} from "@/app/strategy/AddStrategyToAsset/[publicId]/page";
import { ApplyStrategyInput } from "@/app/strategy/ApplyStrategy/[publicId]/page";
import { EditPositionManagement } from "@/app/strategy/EditPositionManagement/[publicId]/page";
import { EditRiskManagement } from "@/app/strategy/EditRiskManagement/[publicId]/page";
import { GetStrategy } from "@/app/strategy/View/[publicId]/page";
import { ListStrategies } from "@/app/strategy/page";
import { TargetLevels } from "@/features/components/asset/viewAsset/AssetTargets";
import { verifyAuth } from "@/lib/auth";
import axios from "axios";
import { UUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const api = "https://localhost:44309/api/";

export const checkverify = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("jwtToken")!.value;

  return await verifyAuth(token);
};

export async function getUserId() {
  return await checkverify().then((data) => data.userPublicId!);
}

export const listStrategies = async (): Promise<ListStrategies[]> => {
  try {
    const response = await axios.get(`${api}ListStrategy/${await getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }
};

export const listStrategiesForAsset = async (
  assetPublicId: UUID,
): Promise<ListStrategiesForAsset[]> => {
  try {
    const userId = await getUserId();
    const response = await axios.get(
      `${api}AddStrategyToAsset/${userId}/${assetPublicId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }
};

export const addStragyToAsset = async (
  addToStrategy: AddToStrategy,
): Promise<boolean> => {
  try {
    const response = await axios.post<boolean>(
      api + "AddStrategyToAsset",
      addToStrategy,
    );

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error adding strategy to asset:", error);
    return false;
  }
};

export const applaStrategy = async (publicId: string): Promise<ApplyStrategyInput> => {
  let userId = await getUserId();
  const response = await axios.get(`${api}ApplyStrategies/${publicId}/${userId}`);
  const data = response.data;
  return data as ApplyStrategyInput;
}

export const listTargets = async (publicId: string): Promise<TargetLevels> => {
  const response = await axios.get(`${api}ListTargets/${publicId}`);
  const data = response.data;
  return data as TargetLevels;
};

export const deleteTarget = async (
  publicId: UUID,
  name: string,
): Promise<boolean> => {
  const response = await axios.delete(`${api}DeleteTarget/${publicId}/${name}`);
  if (response.status === 200) {
    return true;
  }
  return false;
};

export const getStrategy = async (publicId: UUID): Promise<GetStrategy> => {
  let userId = await getUserId();
  const response = await axios.get(`${api}GetStrategy/${publicId}/${userId}`);

  const data = response.data;
  return data as GetStrategy;
};

export async function createStrategy(stragy: Partial<AddStragy>) {
  stragy.userPublicId = await checkverify().then((data) => data.userPublicId!);

  const response = await axios.post<boolean>(`${api}AddStrategies`, stragy);
  if (response.status === 200) {
    redirect(`/strategy`);
  } else {
    redirect("/");
  }
}

export const editEditRiskManagementGet = async (
  publicId: string,
): Promise<EditRiskManagement> => {
  try {
    const response = await axios.get(`${api}GetRiskManagement/${publicId}`);
    const data = response.data;
    return data as EditRiskManagement;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editRiskManagementPost = async (
  model: EditRiskManagement,
): Promise<boolean> => {
  const response = await axios.put<boolean>(`${api}PutRiskManagement/`, model);
  if (response.status === 200) {
    return true;
  }
  return false;
};

export const editPositionManagementGet = async (
  publicId: string,
): Promise<EditPositionManagement> => {
  try {
    const response = await axios.get(`${api}GetPositionManagement/${publicId}`);
    const data = response.data;
    return data as EditPositionManagement;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editPositionManagementPost = async (
  model: EditPositionManagement,
): Promise<boolean> => {
  const response = await axios.put<boolean>(
    `${api}PutPositionManagement/`,
    model,
  );
  if (response.status === 200) {
    return true;
  }
  return false;
};
