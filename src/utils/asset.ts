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
