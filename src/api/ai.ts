"use server";

import axios from "axios";
import { getUserId } from "./helpers/apiHelpers";

const api = "http://127.0.0.1:8000/chat";

export interface SendMessageAi {
    userId: string | null;
    message: string;
    thread_id: string;
}

export interface RespondMessageAi {
    userId: string | null;
    response: string;
    thread_id: string;
    current_question : string
}

export const investmentGoalPost = async (model: SendMessageAi): Promise<RespondMessageAi> => {
    let userPublicId = await getUserId();
    model.userId = userPublicId;

    const res = await axios.post(`${api}`, model);

    model.userId = userPublicId;
    
    console.log(res.data)

    return res.data
  };