import { useState, useCallback } from 'react';

/**
 * A generic hook for managing async API calls, capturing loading, error, and data states.
 */
export function useApi<TData, TArgs extends any[]>(
  apiFunc: (...args: TArgs) => Promise<TData>,
  initialData: TData | null = null
) {
  const [data, setData] = useState<TData | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<TData | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: any) {
        let errorMessage = 'An unexpected error occurred';
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    setData, // Expose for optimistic UI updates
    loading,
    error,
    execute,
  };
}
