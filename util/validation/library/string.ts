import { ValidationError } from "./number";

export function string(
  name: string = "Value",
  options?: Partial<{
    coerce?: boolean;
    fallbackValue: string | undefined;
  }>
) {
  const { coerce, fallbackValue } = {
    coerce: true,
    fallbackValue: undefined,
    ...options,
  };

  function chain(
    oldAssert: (value: unknown) => string,
    fun: (value: string) => string
  ) {
    const newAssert = (value: unknown) => fun(oldAssert(value));
    return {
      minLength: (minLength: number) =>
        chain(newAssert, (value) => {
          if (value.length < minLength) {
            throw new ValidationError(
              name,
              `must be at least ${minLength} characters`
            );
          }
          return value;
        }),
      maxLength: (maxLength: number) =>
        chain(newAssert, (value) => {
          if (value.length > maxLength) {
            throw new ValidationError(
              name,
              `must be at most ${maxLength} characters`
            );
          }
          return value;
        }),
      pattern: (pattern: RegExp) =>
        chain(newAssert, (value) => {
          if (!pattern.test(value)) {
            throw new ValidationError(name, `must match ${pattern}`);
          }
          return value;
        }),
      assert: newAssert,
    };
  }

  return chain(
    (value) => {
      if (typeof value !== "string") {
        if (coerce) {
          return String(value);
        }
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        throw new ValidationError(name, "must be a string");
      }
      return value;
    },
    (value) => value
  );
}
