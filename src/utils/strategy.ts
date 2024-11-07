"use server";

import { handleError } from "@/helpers/ErrorHandler";
import { verifyAuth } from "@/lib/auth";
import { AddStragy } from "@/types/strategy";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const api = "https://localhost:44309/api/strategies";

export const checkverify = async () => {
    const cookieStore = cookies();
    const token = cookieStore.get("jwtToken")!.value;
  
    return await verifyAuth(token);
  };

export async function createStrategy(formData: Partial<AddStragy>) {

     formData.userPublicId = await checkverify().then((data) => data.userPublicId!);

     console.log(formData);

      const response = await axios.post<boolean>(api + "/AddStrategy", formData);
      if (response.status === 200) {
        redirect(`/investing`);
      } else {
        redirect("/");
      }
  }