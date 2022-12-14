import { NextApiResponse } from "next";

const errorStatusCodes = {
  ValidationError: 400,
  NotFoundError: 404,
  UnauthorizedError: 401,
  MethodNotAllowedError: 405,
  ConflictError: 409,
};

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class MethodNotAllowedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "MethodNotAllowedError";
  }
}

export class ValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ConflictError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export function handleError(error: Error, res: NextApiResponse) {
  if (Object.hasOwn(errorStatusCodes, error.name)) {
    res
      .status(errorStatusCodes[error.name as keyof typeof errorStatusCodes])
      .json({ name: error.name, message: error.message });
  } else {
    console.error(error);
    res
      .status(500)
      .json({ name: "ServerError", message: "Internal server error" });
  }
}

/**
 * Propagates an error in a server response to the frontend by throwing an error.
 * @param response respnose from the server
 */
export function propagateError(status: number, responseData: any) {
  for (const key in errorStatusCodes) {
    if (errorStatusCodes[key as keyof typeof errorStatusCodes] === status) {
      throw new Error(responseData?.message);
    }
  }
}