import { ValidationError } from "./number";

export function boolean(
  name: string = "Value",
  options?: Partial<{ coerce?: boolean; fallbackValue: boolean | undefined }>
) {
  const { coerce, fallbackValue } = {
    coerce: true,
    fallbackValue: undefined,
    ...options,
  };

  function chain(
    oldAssert: (value: unknown) => boolean,
    fun: (value: boolean) => boolean
  ) {
    const newAssert = (value: unknown) => fun(oldAssert(value));
    return {
      true: () =>
        chain(newAssert, (value) => {
          if (!value) {
            throw new ValidationError(name, "must be true");
          }
          return value;
        }),
      false: () =>
        chain(newAssert, (value) => {
          if (value) {
            throw new ValidationError(name, "must be false");
          }
          return value;
        }),
      assert: newAssert,
    };
  }

  return chain(
    (value) => {
      if (typeof value !== "boolean") {
        if (coerce) {
          return Boolean(value);
        }
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        throw new ValidationError(name, "must be a boolean");
      }
      return value;
    },
    (value) => value
  );
}
