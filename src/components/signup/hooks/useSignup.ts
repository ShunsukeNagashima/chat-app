import { useCallback } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

import { SignupSchema, SignupFormInput } from './type';

import { useBoolean } from '@/hooks/useBoolean';
import { useErrorHandler } from '@/hooks/useErrorHandler/useErrorHandler';
import { firebaseApp } from '@/lib/firebase-client';
import { userRepository } from '@/repository/user/user-repository';
import { useAuthStore } from '@/store/auth-store';
import { useToastMessageStore } from '@/store/toast-message-store';

const auth = getAuth(firebaseApp);

export const useSignup = () => {
  const router = useRouter();
  const [isLoading, { on: startLoading, off: finishLoading }] = useBoolean(false);
  const { setUser } = useAuthStore();
  const { resetError, handleError } = useErrorHandler();
  const { setSuccessToastMessage } = useToastMessageStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInput>({
    resolver: zodResolver(SignupSchema),
  });

  const registerUser = useCallback(
    async (userId: string, name: string, email: string, idToken: string) => {
      const req = {
        userId,
        name,
        email,
        idToken,
      };
      await userRepository.create(req);
    },
    [],
  );

  const handleSignup: SubmitHandler<SignupFormInput> = useCallback(
    async (data) => {
      const { userName, email, password } = data;
      try {
        startLoading();
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await result.user.getIdToken();
        await registerUser(result.user.uid, userName, result.user.email as string, idToken);
        setUser(result.user);
        setSuccessToastMessage('Successfully signed up!');
        router.push('/');
        resetError();
      } catch (err) {
        handleError(err);
      } finally {
        finishLoading();
      }
    },
    [
      router,
      registerUser,
      setUser,
      startLoading,
      finishLoading,
      handleError,
      resetError,
      setSuccessToastMessage,
    ],
  );

  return { errors, isLoading, handleSubmit, handleSignup, register };
};
