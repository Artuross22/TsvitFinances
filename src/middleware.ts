import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(request : NextRequest) {
  const token = request.cookies.get("user-token")?.value;

  const verifiedToken = token && ( await verifyAuth(token).catch((err) => {
    console.error(err);
  })); 

  if(request.nextUrl.pathname.startsWith("/login") && !verifiedToken) {
    return
  }

  if(request.url.includes("/login") && !verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if(!verifiedToken) {
   return NextResponse.redirect(new URL("/login", request.url));
}
}

export const config = {
  matcher: ["/dashboard", "/login"],
}
