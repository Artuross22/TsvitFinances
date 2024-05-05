"use server";
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import {z} from 'zod'

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

export const editAsset = async (formData: FormData): Promise<void> => {
  const id = formData.get("id") as string;
  const currentPrice = Number(formData.get("currentPrice"));
  const active = Boolean(formData.get("active"));
  const name = formData.get("name") as string | undefined;
  const boughtFor = Number(formData.get("boughtFor"));

  await prisma.asset.update({
    where: {
      id: id,
    },
    data: {
      name: name,
      currentPrice: currentPrice,
      active: active,
      boughtFor: boughtFor,
    },
  });
  redirect(`/investing/ViewAsset/${id}`);
};
