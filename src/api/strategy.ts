"use server";

import {
  AddInvestmentIdeaGet,
  AddInvestmentIdeaPost,
} from "@/app/investmentIdea/Add/page";
import {
  AssetsForIdea,
  EditInvestmentIdea,
} from "@/app/investmentIdea/Edit/[publicId]/page";
import { ListInvestmentIdeas } from "@/app/investmentIdea/ListIdeas/page";
import { ViewInvestmentIdea } from "@/app/investmentIdea/View/[publicId]/page";
import { AddStragy } from "@/app/strategy/AddStrategy/page";
import {
  AddToStrategy,
  ListStrategiesForAsset,
} from "@/app/strategy/AddStrategyToAsset/[publicId]/page";
import { ApplyStrategyInput } from "@/app/strategy/ApplyStrategy/[publicId]/page";
import { EditPositionManagement } from "@/app/strategy/EditPositionManagement/[publicId]/page";
import { EditRiskManagement } from "@/app/strategy/EditRiskManagement/[publicId]/page";
import { EditDiversification } from "@/app/strategy/ManageDiversification/[publicId]/[strategyId]/page";
import { GetStrategy } from "@/app/strategy/View/[publicId]/page";
import { ListStrategies } from "@/app/strategy/page";
import { TargetLevels } from "@/features/components/asset/viewAsset/AssetTargets";
import axios from "axios";
import { UUID } from "crypto";
import { redirect } from "next/navigation";
import { api, checkverify, getUserId } from "./helpers/apiHelpers";
import { GetPositionScaling } from "@/app/strategy/EditPositionScalingManagement/[publicId]/page";
import { FinanceDataStockMetrics } from "@/app/strategy/AddStockMetrics/[publicId]/[strategyId]/page";
import { ApplyStockMetricsModel } from "@/features/components/asset/viewAsset/ApplyStockMetrics";
import { EditStrategy } from "@/types/strategy";
import { PositionRuleBinding } from "@/types/positionRule";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

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

export const applaStrategy = async (
  publicId: string,
): Promise<ApplyStrategyInput> => {
  let userId = await getUserId();
  const response = await axios.get(
    `${api}ApplyStrategies/${publicId}/${userId}`,
  );
  const data = response.data;
  return data as ApplyStrategyInput;
};

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
  const response = await axios.get<GetStrategy>(`${api}GetStrategy/${publicId}/${userId}`);
  return response.data;
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

export const editStrategyGet = async (publicId: string) => {
  let userId = await getUserId();
  console.log("WTF", publicId);
  const response = await axios.get<EditStrategy>(`${api}EditStrategy/${publicId}/${userId}`);
  return response.data;
};

export const editStrategyPost = async (
  model: EditStrategy,
): Promise<boolean> => {
  const response = await axios.put<boolean>(`${api}EditStrategy/`, model);
  if (response.status === 200) {
    return true;
  }
  return false;
};

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

export const editPositionScalingManagerGet = async (publicId: string): Promise<GetPositionScaling> => {
  try {
    const response = await axios.get(`${api}GetPositionManagement/${publicId}`);
    const data = response.data;
    return data as GetPositionScaling;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editPositionScalingManagerPost = async (
  model: GetPositionScaling,
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

export async function getDiversifications(publicId: string) {
  try {
    const response = await axios.get(`${api}EditDiversification/${publicId}`);
    const data = response.data;
    return data as EditDiversification;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function updateDiversification(model: EditDiversification) {
  const response = await axios.post<boolean>(
    `${api}EditDiversification`,
    model,
  );
  if (response.status !== 200) {
    redirect("/");
  }
}

export async function createInvestmentIdeaGet() {
  let userId = await getUserId();
  const response = await axios.get<AddInvestmentIdeaGet[]>(
    `${api}AddInvestmentIdea/${userId}`,
  );
  if (response.status === 200) {
    return response.data;
  } else {
    redirect("/");
  }
}

export async function createInvestmentIdeaPost(model: AddInvestmentIdeaPost) {
  model.appUserId = await getUserId();
  const response = await axios.post(`${api}AddInvestmentIdea`, model);
  if (response.status === 200) {
    redirect(`/investmentIdea/view${response.data}`);
  } else {
    redirect("/error");
  }
}

export async function listInvestmentIdeas() {
  let userId = await getUserId();
  const response = await axios.get<ListInvestmentIdeas[]>(
    `${api}ListInvestmentIdeas/${userId}`,
  );
  if (response.status === 200) {
    return response.data;
  } else {
    redirect("/");
  }
}

export async function viewInvestmentIdea(publicId: string) {
  const response = await axios.get<ViewInvestmentIdea>(
    `${api}ViewInvestmentIdea/${publicId}`,
  );
  return response.data;
}

export async function editInvestmentIdeaGet(publicId: string) {
  const response = await axios.get<EditInvestmentIdea>(
    `${api}EditInvestmentIdea/${publicId}`,
  );
  return response.data;
}

export async function investmentIdeaPost(model: EditInvestmentIdea) {
  const response = await axios.post(`${api}EditInvestmentIdea`, model);
  if (response.status === 200) {
    redirect(`/InvestmentIdea/View/${model.publicId}`);
  } else {
    redirect("/error");
  }
}

export async function getAllAssetsForIdea() {
  let userPublicId = await getUserId();
  const response = await axios.get<AssetsForIdea[]>(
    `${api}GetAssetsForIdea/${userPublicId}`,
  );
  return response.data;
}

export async function deleteInvestmentIdea(publicId: string) {
  const response = await axios.delete(`${api}DeleteInvestmentIdea/${publicId}`);
  if (response.status === 200) {
    redirect(`/InvestmentIdea/ListIdeas`);
  }
}

export async function createStockMetrics(stragy: FinanceDataStockMetrics) {

  const response = await axios.post<boolean>(`${api}AddStockMetrics`, stragy);
  if (response.status === 200) {
    redirect(`/strategy`);
  } else {
    redirect("/");
  }
}

export const applyStockMetrics = async (publicId: string, assetPublicId: string): Promise<ApplyStockMetricsModel> => {
  const response = await axios.get(`${api}ApplyStockMetrics/${publicId}/${assetPublicId}`);

  const data = response.data;

  return data;
};

export const positionRulePost = async (model: PositionRuleBinding) => {
  const response = await axios.post(`${api}ManagePositionRule`, model);
  return response.data;
}

export const positionRuleGet = async (publicId : string) => {
      const response = await axios.get<PositionRuleBinding>(`${api}ManagePositionRule/${publicId}`);
      return response.data;
}
