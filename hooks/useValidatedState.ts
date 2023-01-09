import { useCallback, useState } from "react";

export function useValidatedState<K>(
  initialState: K,
  validator: (value: unknown) => K
) {
  const [state, setState] = useState({
    value: initialState,
    error: "",
  });

  const setValue = useCallback((value: K) => {
    try {
      validator(value);
      setState({
        value,
        error: "",
      });
    } catch (e) {
      setState({
        value,
        error: ((e) => {
          if (e instanceof Error) {
            return e.message;
          }
          return new String(e).toString();
        })(e),
      });
    }
  }, [validator]);

  return [state.value, setValue, state.error] as const;
}