import { NextApiRequest } from "next";
import { verifyJWT } from "../jwt";

export default function getUserIdFromReq(
  req: { cookies: Partial<{ [key: string]: string; }> }
): string | undefined {
  const { auth: token } = req.cookies;
  if (!token) return undefined;
  try {
    const payload = verifyJWT(token);
    return payload.id;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
