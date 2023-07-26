import { useState, useCallback } from 'react';

import { HTTPError } from 'ky';

type ServerError = {
  error: string;
};

export function useErrorHandler() {
  const [error, setError] = useState('');

  const handleError = useCallback(async (err: unknown) => {
    if (err instanceof HTTPError) {
      const serverError = (await err.response.json()) as ServerError;
      setError(serverError.error);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('Unexpected error occurred');
    }
  }, []);

  const resetError = useCallback(() => {
    setError('');
  }, []);

  return { error, handleError, resetError };
}
