"use server";
import { Asset } from "@/types/asset";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from 'axios';
import { handleError } from "@/helpers/ErrorHandler";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const api = "https://localhost:44309/api/Assets/";

export const createAsset = async (asset: Partial<Asset>) => {
  try {
    const response = await axios.post<Asset>(api, asset);

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
    const response = await axios.get<Asset[]>(api);
    const data = response.data;

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getAsset = async (id: string): Promise<Asset> => {
  try {
    const response = await axios.get(`${api}${id}`);
    const data = response.data;
    return data as Asset;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const editAsset = async (asset: Asset): Promise<void> => {
  try {
    const response = await axios.put<Asset>(api, asset);  

    if (response.status === 200) {
      redirect(`/investing/ViewAsset/${asset.id}`);
    } else {
      redirect("/");
    } 
  }
  catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteAsset = async (id: string) => {
  try {
    const response = await axios.delete(`https://localhost:44309/api/Assets?id={id}`);
    
    if (response.status === 200) {
      revalidatePath("/investing");
      redirect("/investing");
    } else {
      redirect("/");
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
