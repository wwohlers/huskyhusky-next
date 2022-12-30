import JWT from "jsonwebtoken";
import { NextApiResponse } from "next";
import { UnauthorizedError } from "./api/handleError";

const JWT_SECRET = process.env.JWT_SECRET;

export function signJWT(payload: any, expiration = "30d"): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  return JWT.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyJWT(token: string): any {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  try {
    const payload = JWT.verify(token, JWT_SECRET) as any;
    return payload;
  } catch (e) {
    throw new UnauthorizedError("JWT expired");
  }
}

export function getUserIdFromReq(req: {
  cookies: Partial<{ [key: string]: string }>;
}): string | undefined {
  const { auth: token } = req.cookies;
  if (!token) return undefined;
  try {
    const payload = verifyJWT(token);
    return payload.id;
  } catch (e) {
    return undefined;
  }
}
