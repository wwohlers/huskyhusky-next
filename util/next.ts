import { GetStaticProps } from "next";

export const DEFAULT_REVALIDATE_PERIOD = 60; // 60 mins

/**
 * Deeply converts all _id fields to strings. Mutates the original object.
 * @param obj
 */
export function stringifyIds(obj: any) {
  for (const key in obj) {
    if (key === "_id" && obj[key]?.toString) {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] === "object") {
      stringifyIds(obj[key]);
    }
  }
}

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
