import { useState, useCallback } from 'react';

import { HTTPError } from 'ky';

type ServerError = {
  error: string;
};

export function useErrorHandler() {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(async (err: unknown) => {
    console.error(err);
    setHasError(true);
    if (err instanceof HTTPError) {
      const serverError = (await err.response.json()) as ServerError;
      console.error(serverError.error);
    } else if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error('Unexpected error occurred');
    }
  }, []);

  const resetError = useCallback(() => {
    setHasError(false);
  }, []);

  return { hasError, handleError, resetError };
}
