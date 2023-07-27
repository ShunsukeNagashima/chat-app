import { useState, useCallback } from 'react';

import { FirebaseError } from '@firebase/util';
import { HTTPError } from 'ky';

import { useToastMessageStore } from '@/store/toast-message-store';

type ServerError = {
  error: string;
};

export function useErrorHandler() {
  const [error, setError] = useState('');
  const { setErrorToastMessage } = useToastMessageStore();

  const handleError = useCallback(
    async (err: unknown) => {
      if (err instanceof HTTPError) {
        const serverError = (await err.response.json()) as ServerError;
        setError(serverError.error);
      } else if (err instanceof FirebaseError) {
        console.log(err.code);
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError(err.message);
            setErrorToastMessage('The email address is already in use by another account');
            break;
          case 'auth/user-not-found' || 'auth/wrong-password':
            setError(err.message);
            setErrorToastMessage('Email or password is incorrect');
            break;
          default:
            setError(err.message);
            setErrorToastMessage(
              'Failed to authenticate for an unknown reason. Please try again later.',
            );
        }
      } else if (err instanceof Error) {
        setError(err.message);
        setErrorToastMessage(err.message);
      } else {
        setError('Unexpected error occurred');
        setErrorToastMessage('Unexpected error occurred');
      }
    },
    [setErrorToastMessage],
  );

  const resetError = useCallback(() => {
    setError('');
  }, []);

  return { error, handleError, resetError };
}
