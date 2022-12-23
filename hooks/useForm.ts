import { useMemo, useState } from "react";
import { Validator } from "../util/validation";

type FormFields = Record<string, any>;

type FormItemData<K> = {
  value: K;
  error: string;
  validator: Validator<K>; // throws error if invalid
};

type FormData<K extends FormFields> = {
  [P in keyof K]: FormItemData<K[P]>;
};

type Validators<K extends FormFields> = {
  [P in keyof K]: Validator<K[P]>;
};

export function useForm<K extends FormFields>(
  initialState: K,
  validators: Partial<Validators<K>> = {}
) {
  const [state, setState] = useState<FormData<K>>(
    Object.fromEntries(
      Object.entries(initialState).map(([key, value]) => {
        const validator = validators[key] ?? ((val) => val);
        return [key, { value, error: "", validator }];
      })
    ) as FormData<K>
  );

  const onFieldChange = (field: keyof K) => (value: K[typeof field]) => {
    const validator = state[field].validator;
    try {
      validator(value);
      setState((prevState) => ({
        ...prevState,
        [field]: {
          value,
          error: "",
          validator,
        },
      }));
    } catch (e) {
      setState((prevState) => ({
        ...prevState,
        [field]: {
          value,
          error: ((e) => {
            if (e instanceof Error) {
              return e.message;
            }
            return new String(e);
          })(e),
          validator,
        },
      }));
    }
  };

  const values = useMemo(() => {
    return Object.fromEntries(
      Object.entries(state).map(([key, value]) => {
        return [key, value.value];
      })
    ) as K;
  }, [state]);

  const errors = useMemo(() => {
    return Object.fromEntries(
      Object.entries(state).map(([key, value]) => {
        return [key, value.error];
      })
    ) as K;
  }, [state]);

  const hasErrors = useMemo(() => {
    return Object.values(state).some((item) => !!item.error);
  }, [state]);

  return { values, errors, onFieldChange, hasErrors };
}
