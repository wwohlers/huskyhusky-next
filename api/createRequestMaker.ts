import { AxiosError } from "axios";
import { MethodHandler, MethodHandlers } from "./createHandler";
import { propagateError } from "./handleError";
import hhAxios from "./request/axios";

export type RequestMaker<B, R> = {} extends B ? () => Promise<R> : (body: B) => Promise<R>;

export type RequestMakerReturn<K extends MethodHandlers> = {
  [key in keyof K]: K[key] extends MethodHandler<infer B, infer R>
    ? RequestMaker<B, R>
    : never;
};

export default function createRequestMakers<K extends MethodHandlers>(
  path: string,
  requestMakerData: K
) {
  return Object.fromEntries(
    Object.entries(requestMakerData).map(([method]) => {
      const requestMaker = async (body: any) => {
        try {
          const res = await hhAxios(path, {
            method,
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              ...body,
            },
          });
          return res.data;
        } catch (e) {
          if (e instanceof AxiosError) {
            propagateError(e.status ?? 500, e.response?.data);
          }
        }
      };
      return [method, requestMaker];
    })
  ) as RequestMakerReturn<K>;
}
