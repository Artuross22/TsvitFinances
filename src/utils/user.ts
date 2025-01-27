"use server";

import axios from "axios";
import { api, getUserId } from "./helpers/apiHelpers";
import { ViewUser } from "@/app/userManagement/View/page";
import { AddBalanceFlow } from "@/features/components/userManagement/addBalanceFlow/page";

export async function viewUserGet() {
    const response = await axios.get<ViewUser>(
      `${api}ViewUser/${await getUserId()}`,
    );
    return response.data;
  }

  export async function addBalanceFlow(model: AddBalanceFlow) {
    model.appUserId = await getUserId();
    const response = await axios.post<ViewUser>(
      `${api}AddBalanceFlow`, model,
    );

    if(response.status === 200) {
        return true;
    }
  }