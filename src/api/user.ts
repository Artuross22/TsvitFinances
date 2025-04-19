"use server";

import axios from "axios";
import { api, getUserId } from "./helpers/apiHelpers";
import { ViewUser } from "@/app/userManagement/View/page";
import { AddBalanceFlow } from "@/features/components/userManagement/addBalanceFlow/page";
import { TransferBalanceFlow } from "@/features/components/userManagement/transferBalanceFlow/page";

export async function viewUserGet() {
  const response = await axios.get<ViewUser>(
    `${api}ViewUser/${await getUserId()}`,
  );
  return response.data;
}

export async function addBalanceFlow(model: AddBalanceFlow) {
  model.appUserId = await getUserId();
  const response = await axios.post(`${api}AddBalanceFlow`, model);

  if (response.status === 200) {
    return true;
  }
}

export async function transferBalanceFlow(model: TransferBalanceFlow) {
  model.appUserId = await getUserId();
  const response = await axios.post(`${api}TransferBalanceFlow`, model);

  if (response.status === 200) {
    return true;
  }
}