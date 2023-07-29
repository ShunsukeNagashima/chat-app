import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, set } from 'react-hook-form';

import { SigninFormInput, SigninSchema } from './type';

import { useBoolean } from '@/hooks/useBoolean';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { firebaseApp } from '@/lib/firebase-client';
import { userRepository } from '@/repository/user/user-repository';
import { useAuthStore } from '@/store/auth-store';
import { useToastMessageStore } from '@/store/toast-message-store';

const auth = getAuth(firebaseApp);

export const useSignin = () => {
  const router = useRouter();
  const [isLoading, { on: startLoading, off: finishLoading }] = useBoolean(false);
  const { setUser } = useAuthStore();
  const { resetError, handleError } = useErrorHandler();
  const { setSuccessToastMessage } = useToastMessageStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormInput>({
    resolver: zodResolver(SigninSchema),
  });

  const handleSignin: SubmitHandler<SigninFormInput> = useCallback(
    async (data) => {
      try {
        startLoading();
        const { email, password } = data;
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = await userRepository.fetchById({ userId: result.user.uid });
        setUser(user);
        resetError();
        setSuccessToastMessage('Successfully signed in!');
        router.push('/');
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [router, setUser, startLoading, finishLoading, setSuccessToastMessage, handleError, resetError],
  );

  return { errors, isLoading, handleSignin, handleSubmit, register };
};
