import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export const apiTsvit = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7095/api/";

export const checkverify = async () => {
  try {
    const cookieStore = cookies();
    const jwtCookie = cookieStore.get("jwtToken");
    
    if (!jwtCookie || !jwtCookie.value) {
      throw new Error("Authentication failed: No JWT token found");
    }

    return await verifyAuth(jwtCookie.value);
  } catch (error) {
    console.error("Error in checkverify:", error);
    throw error;
  }
};

export async function getUserId() {
  try {
    const authData = await checkverify();
    if (!authData || !authData.userPublicId) {
      throw new Error("Authentication failed: Invalid or missing user data");
    }
    return authData.userPublicId;
  } catch (error) {
    console.error("Error in getUserId:", error);
    throw error;
  }
}
