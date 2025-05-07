import useSWR from "swr";
import axios from "axios";
import useDebounce from "./use-debounce";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useFlightSearch(url: string, query: string) {
  const debouncedQuery = useDebounce(query, 500);
  const { data, error, isLoading } = useSWR(
    debouncedQuery ? `${url}?name=${debouncedQuery}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
      shouldRetryOnError: false,
    },
  );

  return {
    city: data?.data,
    isLoading,
    isError: error,
    isEmpty: data?.data?.length === 0,
  };
}
