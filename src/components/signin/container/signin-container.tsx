import { useCallback, useEffect, useState } from 'react';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { SigninPresenter } from '../presenter';

import { userClient } from '@/infra/user/user-client';
import { firebaseApp } from '@/lib/firebase-client';
import { useAuthStore } from '@/store/auth-store';

const auth = getAuth(firebaseApp);
const emailSchema = z.string().email();

export const SigninContainer = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  const registerUser = useCallback(
    async (userId: string, name: string, email: string, idToken: string) => {
      const req = {
        userId,
        name,
        email,
        idToken,
      };

      try {
        const result = await userClient.create(req);
      } catch (err) {
        console.error('Failed to register user', err);
      }
    },
    [],
  );

  const handleGoogleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await registerUser(
        result.user.uid,
        result.user.displayName as string,
        result.user.email as string,
        idToken,
      );
      setUser(result.user);
      router.push('/');
    } catch (err) {
      console.error('Signin failed', err);
    }
  }, [setUser, router, registerUser]);

  const handleEmailLinkLogin = useCallback(async (email: string) => {
    const actionCodeSettings = {
      url: `http://localhost:3000/signin?email=${email}`,
      handleCodeInApp: true,
    };
    const auth = getAuth(firebaseApp);
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
    } catch (err) {
      console.error('Failed to send signin link', err);
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const parsed = emailSchema.safeParse(email);
      if (!parsed.success) {
        setError('Invalid email address');
        return;
      }
      setError('');
      handleEmailLinkLogin(email);
    },
    [email, handleEmailLinkLogin, setError],
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  useEffect(() => {
    (async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        try {
          const result = await signInWithEmailLink(auth, email as string, window.location.href);
          const idToken = await result.user.getIdToken();

          await registerUser(
            result.user.uid,
            result.user.email?.split('@')[0] as string,
            result.user.email as string,
            idToken,
          );
          window.localStorage.removeItem('emailForSignIn');
          setUser(result.user);
          router.push('/');
        } catch (err) {
          console.error('Failed to sign in', err);
        }
      }
    })();
  }, [setUser, router, registerUser]);

  return (
    <SigninPresenter
      email={email}
      error={error}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleGoogleLogin={handleGoogleLogin}
    />
  );
};
