"use server";
import { Asset } from "@/types/asset";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from "axios";
import { handleError } from "@/helpers/ErrorHandler";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const checkverify = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("jwtToken")!.value;

  return await verifyAuth(token);
};

const api = "https://localhost:44309/api/Assets/";

export const createAsset = async (asset: Partial<Asset>) => {
  try {
    asset.UserPublicId = await checkverify().then((data) => data.userPublicId);
    var token = await checkverify().then((data) => data.jti);

    const response = await axios.post<Asset>(api, asset, {
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
    handleError(error);
  }
};

export const getAllAssets = async (): Promise<Asset[]> => {
  try {
    var token = await checkverify().then((data) => data.jti);

    const response = await axios.get<Asset[]>(api, {
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

export const getAsset = async (id: string): Promise<Asset> => {
  try {
    const response = await axios.get(`${api}${id}`);
    const data = response.data;
    return data as Asset;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editAsset = async (asset: Asset): Promise<void> => {
  try {
    asset.UserPublicId = await checkverify().then((data) => data.userPublicId!);
    const response = await axios.put<Asset>(api, asset);

    if (response.status === 200) {
      redirect(`/investing/ViewAsset/${asset.id}`);
    } else {
      redirect("/");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteAsset = async (root: string, id: string) => {
  let response;

  if (root === "deleteAsset") {
    response = await axios.delete(`${api}${id}`);
  } else if (root === "sellAsset") {
    response = await axios.post(`${api}SellAsset/${id}`);
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
