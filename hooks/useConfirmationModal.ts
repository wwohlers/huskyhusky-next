import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";

type ConfirmationModalResponse = "confirm" | "cancel";

type ConfirmationModalData = {
  title: string;
  message: string;
  response?: ConfirmationModalResponse;
};

export const confirmationModalDataAtom = atom<ConfirmationModalData | null>(
  null
);

export function useConfirmationModal() {
  const [data, setData] = useAtom(confirmationModalDataAtom);
  const [resolve, setResolve] = useState<
    (response: ConfirmationModalResponse) => void
  >(() => {});

  useEffect(() => {
    if (data && data.response) {
      resolve(data.response);
      setData(null);
    }
  }, [data, setData, resolve]);

  return useCallback(
    (title: string, message: string) => {
      setData({
        title,
        message,
      });
      const newPromise = new Promise<ConfirmationModalResponse>((res) => {
        setResolve(() => res);
      });
      return newPromise;
    },
    [setData]
  );
}
