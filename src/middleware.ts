import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./lib/auth";

export async function middleware(request : NextRequest) {
  const token = request.cookies.get("jwtToken")?.value;
  
  const verifiedToken = token && ( await verifyAuth(token).catch((err) => {
    console.error(err);
  })); 

  if(request.nextUrl.pathname.startsWith("/auth") && !verifiedToken) {
    return
  }

  if(request.url.includes("/auth") && verifiedToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if(!verifiedToken) {
   return NextResponse.redirect(new URL("/auth/signIn", request.url));
}
}

export const config = {
  matcher: ["/dashboard", "/login", "/investing/:path*"],
}
