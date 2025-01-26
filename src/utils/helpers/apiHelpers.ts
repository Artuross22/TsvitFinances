import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export const api = "https://localhost:44309/api/";

export const checkverify = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("jwtToken")!.value;

  return await verifyAuth(token);
};

export async function getUserId() {
  return await checkverify().then((data) => data.userPublicId!);
}