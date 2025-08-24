import { jwtVerify, SignJWT } from "jose";

interface UserJwtPayload {
  jti: string;
  iat: number;
  userPublicId?: string;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    if (!token || token.trim() === "") {
      throw new Error("Authentication failed: Empty token provided");
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey()),
    );
    
    if (!verified.payload || !verified.payload.jti) {
      throw new Error("Authentication failed: Invalid token payload");
    }
    
    return verified.payload as UserJwtPayload;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("jwt expired")) {
        throw new Error("Authentication failed: Token expired");
      } else if (err.message.includes("jwt malformed")) {
        throw new Error("Authentication failed: Malformed token");
      } else if (err.message.includes("invalid signature")) {
        throw new Error("Authentication failed: Invalid token signature");
      }
    }
    throw new Error("Authentication failed: Invalid token");
  }
};
