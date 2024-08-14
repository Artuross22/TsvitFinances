import { Asset } from "./asset";

export type AppUser = {
    publicId: string;
    nickname: string;
    firstName: string;
    lastName : string
    Assets: Asset[];
   };