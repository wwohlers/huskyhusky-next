import JWT from "jsonwebtoken";
import { NextApiResponse } from "next";

export type JWTPayload = {
  id: string;
};

const JWT_SECRET = process.env.JWT_SECRET;

export function signJWT(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  return JWT.sign(payload, JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyJWT(token: string): JWTPayload {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not set");
  }
  const payload = JWT.verify(token, JWT_SECRET) as JWTPayload;
  if (
    !payload ||
    typeof payload !== "object" ||
    !Object.hasOwn(payload, "id") ||
    typeof payload["id"] !== "string"
  ) {
    throw new Error("Invalid JWT payload");
  }
  return payload;
}