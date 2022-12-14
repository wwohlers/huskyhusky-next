import { toast } from "react-toastify";

export default function toastError(error: any) {
  if (error instanceof Error) {
    console.error(error.message);
    toast.error(error.message ?? "An unknown error occurred");
  } else {
    console.error(error);
    toast.error("Internal server error");
  }
}