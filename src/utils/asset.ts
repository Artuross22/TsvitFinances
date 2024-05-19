"use server";
import { Asset } from "@/types/asset";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import axios from 'axios';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// import {z} from 'zod'

export const createAsset = async (asset: Partial<Asset>) => {
  try {
    await prisma.asset.create({
      data: {
        name: asset.name ?? "",
        currentPrice: asset.currentPrice ?? 0,
        boughtFor: asset.boughtFor ?? 0,
        profi: asset.profi ?? 0,
        active: asset.active,
      },
    });

    redirect(`/investing`);
  } catch (error) {
    console.log(error);
    return { message: "error" };
  }
};

export const getAllAsset = async () => {
  return await prisma.asset.findMany({
    orderBy: {
      boughtFor: "desc",
    },
  });
};

// export const getAllAsset = async () => {
//   try {
//     const response = await fetch('https://localhost:7095/api/Assets'); // Replace with your API endpoint
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// export const getAllAsset = async (): Promise<Asset[]> => {
//   try {
//     const response = await fetch('https://localhost:7095/api/Assets'); // Replace with your API endpoint
//     const data = await response.json();
//     console.log(data);
//     return data as Asset[];
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// };

// export const getAsset = async (id: string): Promise<Asset> => {
//   try {
//     console.log("EbbDaaa");
//     const response = await fetch(`https://localhost:7095/api/Assets/${id}`);
//     const data = await response.json();
//     console.log("Ebba");
//     console.log(data);
//     return data as Asset;
//   } catch (error) {
//     console.error('Error:', error);
//     console.log("EbbDaaa1");
//     throw error;
    
//   }
// };

export const getAsset = async (id: string): Promise<Asset> => {
  try {
    const response = await axios.get(`https://localhost:44309/api/Assets/`);
    const data = response.data;
    return data as Asset;
  } catch (error) {

    console.error('Error:', error);
    throw error;
  }
};

// const response = await axios.get(`https://localhost:44309/api/Assets/${id}`);


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
      active: formData.active,
      closedAt: formData.active ? undefined : new Date(),
    },
  });

  redirect(`/investing/ViewAsset/${formData.id}`);
};

export const deleteAsset = async (id: string) => {
  await prisma.asset.delete({
    where: { id },
  });

  revalidatePath("/investing");
  redirect("/investing");
};
