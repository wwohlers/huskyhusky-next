import { stringifyIds } from "../services/database";

export function returnProps<K>(props: K): { props: K } {
  stringifyIds(props);
  return {
    props,
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
