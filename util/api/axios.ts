import Axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const hhAxios = Axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const axiosFetcher = (url: string) =>
  hhAxios.get(url).then((res) => res.data);

export default hhAxios;