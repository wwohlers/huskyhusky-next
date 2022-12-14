import { MethodHandler, MethodHandlers } from "./createHandler";
import { propagateError } from "./handleError";
import hhAxios from "./request/axios";

export type RequestMakerReturn<K extends MethodHandlers> = {
  [key in keyof K]: K[key] extends MethodHandler<infer B, infer R>
    ? (body: B) => Promise<R>
    : never;
};

export default function createRequestMakers<K extends MethodHandlers>(
  path: string,
  requestMakerData: K
) {
  return Object.fromEntries(
    Object.entries(requestMakerData).map(([method]) => {
      const requestMaker = async (body: any) => {
        const res = await hhAxios(`/api${path}`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            ...body,
          },
        });
        if (res.status < 300) {
          return res.data;
        } else {
          propagateError(res.data);
        }
      };
      return [method, requestMaker];
    })
  ) as RequestMakerReturn<K>;
}
