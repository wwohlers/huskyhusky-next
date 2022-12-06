import Axios from "axios";
import axios from "./axios";

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

function handleError(e: any): ApiResponse<any> {
  if (e instanceof Axios.AxiosError) {
    return {
      success: false,
      error: e.response?.data?.error ?? "Unknown error",
    };
  }
  return {
    success: false,
    error: "Unknown error",
  };
}

export async function get<R>(url: string): Promise<ApiResponse<R>> {
  try {
    const res = await axios.get(url);
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return handleError(e);
  }
}

export async function post<R>(url: string, body?: any): Promise<ApiResponse<R>> {
  try {
    const res = await axios.post(url, body);
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return handleError(e);
  }
}

export async function put<R>(url: string, body?: any): Promise<ApiResponse<R>> {
  try {
    const res = await axios.put(url, body);
    return {
      success: true,
      data: res.data,
    };
  } catch (e) {
    return handleError(e);
  }
}

export const apiClient = {
  get,
  post,
  put,
};