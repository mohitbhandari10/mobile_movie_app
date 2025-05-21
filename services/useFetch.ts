import { useEffect, useState } from "react"

const useFetch_trend = <T,>(
      fetchFunction : () => Promise<T> ,
       autoFetch= true
      )=> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);


    const fetchData = async() => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        }
        catch(err) {
            // @ts-ignore
            setError(err instanceof Error ? err :new Error('An Error Ocurred'));
        } 
        finally {
            setLoading(false)
        }
    }

    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    useEffect(() => {
        if(autoFetch) {
            fetchData();

        }

    },[]);

    return { data ,loading , error , refetch: fetchData, reset};

}



  const useFetch = <T extends any[]>(

    fetchFunction: (page: number) => Promise<{ results: T; page: number; totalPages: number }>,
    autoFetch = true
  ) => {
    const [data, setData] = useState<T>([] as unknown as T);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
  
    const fetchData = async (append = false) => {
      if (loading || !hasMore) return;
  
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction(page);
  
        // setData((prev: T) =>
        //   append ? [...(prev || []), ...(result.results || [])] : result.results
        // );

      setData((prev: T) =>
        append ? [...prev, ...result.results] as T : result.results
      );
        setHasMore(result.page < result.totalPages);
        setPage((prev) => prev + 1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    };
  
    const reset = () => {
      setData([] as unknown as T);
      setLoading(false);
      setError(null);
      setPage(1);
      setHasMore(true);
    };
  
    useEffect(() => {
      if (autoFetch) {
        fetchData();
      }
    }, []);
  
    return { data, loading, error, refetch: () => fetchData(false), loadMore: () => fetchData(true), reset, hasMore };
  };
  

export default useFetch;