import { Login } from "@/types/Login";
import axios from "axios";
import Cookies from 'js-cookie';

const api = "https://localhost:44309/api/Auth/login";

export const signIn = async (signIn: Login) => {
  try {
    const response = await axios.post<{ token: string, email: string }>(api, signIn);
    Cookies.set('jwtToken', response.data.token, { expires: 1, secure: true });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
