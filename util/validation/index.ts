import { ValidationError } from "../../services/api/handleError";

export type Validator<K> = (value: any) => K;

export function isString(value: any): string {
  if (typeof value !== "string") {
    throw new ValidationError("Invalid type (should be string)");
  }
  return value;
}

export function isNumber(value: any): number {
  if (typeof value !== "number") {
    throw new ValidationError("Invalid type (should be number)");
  }
  return value;
}

export function isBoolean(value: any): boolean {
  if (typeof value !== "boolean") {
    throw new ValidationError("Invalid type (should be boolean)");
  }
  return value;
}

export function isObject(value: any): object {
  if (typeof value !== "object") {
    throw new ValidationError("Invalid type (should be object)");
  }
  return value;
}

export function createArrayValidator<K>(
  validator: (elm: any) => K
): (arr: any) => K[] {
  return (arr: any) => {
    if (!Array.isArray(arr)) {
      throw new Error("Invalid type (should be array)");
    }
    for (const elm of arr) {
      validator(elm);
    }
    return arr;
  };
}

export function createIdValidator(): (value: any) => string {
  return isString;
}

export function createTextFieldValidator(
  minLength: number,
  maxLength: number
): (value: any) => string {
  return (value: any): string => {
    const strValue = isString(value);
    if (strValue.length < minLength) {
      throw new ValidationError(
        `Text must be at least ${minLength} characters long`
      );
    } else if (strValue.length > maxLength) {
      throw new ValidationError(
        `Text must be at most ${maxLength} characters long`
      );
    }
    return strValue;
  };
}

export function createEmailValidator(): (value: any) => string {
  return (value: any) => {
    const strValue = isString(value);
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(strValue)) {
      throw new ValidationError("Invalid email format");
    }
    return value;
  };
}

/**
 * Validate a new password that's entered by the user to sign up or change their password.
 * @param password
 * @returns
 */
export function createNewPasswordValidator(): (password: any) => string {
  return (value: any) => {
    const strValue = isString(value);
    if (strValue.length < 12) {
      throw new ValidationError("Password must be at least 12 characters long");
    }
    const hasNumber = /\d/.test(strValue);
    const hasLowercase = /[a-z]/.test(strValue);
    const hasUppercase = /[A-Z]/.test(strValue);
    if (!hasNumber || !hasLowercase || !hasUppercase) {
      throw new ValidationError(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      );
    }
    return value;
  };
}

/**
 * Validate a password that's entered by the user to log in (i.e. not a new password).
 * @param password
 * @returns
 */
export function createEnteredPasswordValidator(): (value: any) => string {
  return (value: any) => {
    const strValue = isString(value);
    if (strValue.length === 0) {
      throw new ValidationError("Password cannot be empty");
    }
    return strValue;
  };
}

export function createSchemaValidator<K>(schema: {
  [P in keyof K]: (value: any) => K[P];
}): (value: any) => K {
  return (value) => {
    isObject(value);
    const result: any = {};
    for (const key in schema) {
      result[key] = schema[key](value[key]);
    }
    return result as K;
  };
}

export function allowUndefined<K>(
  validator: (value: any) => K
): (value: any) => K | undefined {
  return (value: any) => {
    if (value === undefined) return value;
    return validator(value);
  };
}

export function createOneOfValidator<K>(
  ...validators: ((value: any) => any)[]
): (value: any) => any {
  return (value) => {
    for (const validator of validators) {
      try {
        return validator(value);
      } catch (err) {
        continue;
      }
    }
    throw new ValidationError("Invalid value");
  };
}
