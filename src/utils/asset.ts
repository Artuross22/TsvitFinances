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



export const editTask = async (formData: FormData) => {
    const id = formData.get("id");
    const content = formData.get("content");
    const completed = formData.get("completed");

    await prisma.asset.update({
      where: { 
        id: id?.toString(),
      },
      data: {
        active: completed === "on" ? true : false,
      },
    });

    redirect("/tasks");
};
