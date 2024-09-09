import { Login } from "@/types/Login";
import axios from "axios";

const api = "https://localhost:44309/api/Auth/login";

export const signIn = async (signIn : Login): Promise<string> => {
    try {
      const response = await axios.post<string>(api, signIn);
      const data = response.data;
      return data as string;
     
    } catch (error) {
      console.error("Error:", error);
      throw error;  
    }
  };