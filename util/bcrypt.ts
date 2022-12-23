/**
 * This file is needed because bcrypt is a native module and cannot be imported in the browser.
 */

let bcrypt: any;

if (typeof window === "undefined") {
  import("bcrypt")
    .then((module) => {
      bcrypt = module;
    })
    .catch((e) => {
      console.error("Error importing bcrypt: ", e);
    });
}

export async function hashPassword(password: string): Promise<string> {
  if (bcrypt) {
    return bcrypt.hash(password, 10);
  } else {
    throw new Error("bcrypt not loaded");
  }
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  if (bcrypt) {
    return bcrypt.compare(password, hash);
  } else {
    throw new Error("bcrypt not loaded");
  }
}
