"use server";

import { verifyAuth } from "@/lib/auth";
import { AddStragy, ListStrategies, GetStrategy } from "@/types/strategy";
import axios from "axios";
import { UUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const api = "https://localhost:44309/api/strategies/";

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
    const response = await axios.get(`${api}${await getUserId()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching strategies:", error);
    return [];
  }
};

export const getStrategy = async (publicId: UUID): Promise<GetStrategy> => {
  let userId = await getUserId();
  const response = await axios.get(api + publicId + "/" + userId);
  const data = response.data;
  return data as GetStrategy;
};

export async function createStrategy(stragy: Partial<AddStragy>) {
  stragy.userPublicId = await checkverify().then((data) => data.userPublicId!);
  const response = await axios.post<boolean>(api, stragy);
  if (response.status === 200) {
    redirect(`/strategy`);
  } else {
    redirect("/");
  }
}
