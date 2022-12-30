import { string } from "./string";

export class ValidationError extends Error {
  constructor(name: string, message: string) {
    super(name + " " + message);
    this.name = "ValidationError";
  }
}

export function number(
  name: string = "Value",
  options?: Partial<{
    coerce?: boolean;
    fallbackValue: number | undefined;
  }>
) {
  const { coerce, fallbackValue } = {
    coerce: true,
    fallbackValue: undefined,
    ...options,
  };
  function chain(
    oldAssert: (value: unknown) => number,
    fun: (value: number) => number
  ) {
    const newAssert = (value: unknown) => fun(oldAssert(value));
    return {
      min: (minValue: number) =>
        chain(newAssert, (value) => {
          if (value < minValue) {
            throw new ValidationError(name, `must be greater than ${minValue}`);
          }
          return value;
        }),
      max: (maxValue: number) =>
        chain(newAssert, (value) => {
          if (value > maxValue) {
            throw new ValidationError(name, `must be less than ${maxValue}`);
          }
          return value;
        }),
      integer: (
        options?: Partial<{
          roundIfNot: boolean;
          divisibleBy: number;
        }>
      ) => {
        const { roundIfNot, divisibleBy } = {
          roundIfNot: true,
          divisibleBy: 1,
          ...options,
        };
        return chain(newAssert, (value) => {
          if (!Number.isInteger(value) && !roundIfNot) {
            throw new ValidationError(name, "must be an integer");
          }
          const rounded = Math.round(value);
          if (rounded % divisibleBy !== 0) {
            throw new ValidationError(
              name,
              `must be divisible by ${divisibleBy}`
            );
          }
          return rounded;
        });
      },
      custom: (
        validator: (value: number, error: (message: string) => void) => number
      ) =>
        chain(newAssert, (value) => {
          return validator(value, (message: string) => {
            throw new ValidationError(name, message);
          });
        }),
      toString: () => ({
        ...string(),
        assert: (value: unknown) => {
          const num = newAssert(value);
          return num.toString();
        }
      }),
      assert: newAssert,
    };
  }

  return chain(
    (value: unknown) => {
      if (typeof value !== "number") {
        if (coerce) {
          const parsed = Number(value);
          if (!Number.isNaN(parsed)) {
            return parsed;
          } else {
            throw new ValidationError(name, "must be numeric");
          }
        }
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        throw new ValidationError(name, "must be a number");
      }
      return value;
    },
    (value) => value
  );
}
