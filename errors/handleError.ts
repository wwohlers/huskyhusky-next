import { NextApiResponse } from "next";

export function handleError(error: Error, res: NextApiResponse) {
  if (error.name === "NotFoundError") {
    res.status(404).json({ error: error.message });
  } else if (error.name === "UnauthorizedError") {
    res.status(401).json({ error: error.message });
  } else {
    console.error(error);
    res.status(500).json({ error: error.message });
  } 
}