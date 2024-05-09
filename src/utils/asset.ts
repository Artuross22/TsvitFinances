"use server";
import { Asset } from "@/types/asset";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import {z} from 'zod'

export const createAsset = async (asset : Partial<Asset>) => {
    try {
      await prisma.asset.create({
        data: {
          name: asset.name ?? '',
          currentPrice: asset.currentPrice ?? 0, 
          boughtFor: asset.boughtFor ?? 0,
          profi: asset.profi ?? 0,
          active: asset.active,
        },
      });

      revalidatePath("/investing");
      return {message:'success'};
    }
    catch (error) {
      console.log(error);
      return {message: 'error'};
    }
};

export const getAllAsset = async () => {
  return await prisma.asset.findMany({
    orderBy: {
      boughtFor: "desc",
    },
  });
};

export const getAsset = async (id: string) => {
  return await prisma.asset.findUnique({
    where: { id },
  });
};

export const editAsset = async (formData: Asset): Promise<void> => {
  await prisma.asset.update({
    where: {
      id: formData.id,
    },
    data: {
      name: formData.name,
      currentPrice: formData.currentPrice,
      boughtFor: formData.boughtFor,
      profi: formData.profi,
    },
  });
  
  redirect(`/investing/ViewAsset/${formData.id}`);
};
