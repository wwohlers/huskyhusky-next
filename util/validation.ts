// import { ValidationError } from "../api/handleError";

import { string } from "deterrent";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const idValidator = string({ name: "ID" });

export const emailValidator = string({ name: "Email" }).pattern(emailRegex, {
  errorMessage: "Invalid email format",
});

export const newPasswordValidator = string({ name: "Password" })
  .minLength(12)
  .pattern(/\d/, { errorMessage: "Password must contain a number" })
  .pattern(/[a-z]/, {
    errorMessage: "Password must contain a lowercase letter",
  })
  .pattern(/[A-Z]/, {
    errorMessage: "Password must contain an uppercase letter",
  });

export const enteredPasswordValidator = string({ name: "Password" }).minLength(
  1,
  { errorMessage: "Please enter a password" }
);
