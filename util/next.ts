import { GetStaticProps } from "next";
import { stringifyIds } from "../services/database";

export const DEFAULT_REVALIDATE_PERIOD = 60; // 60 mins

export function returnProps<K extends { [key: string]: any }>(
  props: K,
  revalidateMins?: number
): ReturnType<GetStaticProps<K>> {
  stringifyIds(props);
  return {
    props,
    ...(revalidateMins ? { revalidate: revalidateMins * 60 } : {}), // seconds
  };
}

export function returnNotFound(): { notFound: true } {
  return {
    notFound: true,
  };
}

export function returnRedirect(
  destination: string,
  permanent = false
): { redirect: { destination: string; permanent: boolean } } {
  return {
    redirect: {
      destination,
      permanent,
    },
  };
}
