import { useCallback, useEffect, useState } from 'react';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';
import { z } from 'zod';

import { SigninPresenter } from '../presenter';

import { firebaseApp } from '@/lib/firebase-client';
import { useAuthStore } from '@/store/auth-store';

const auth = getAuth(firebaseApp);
const emailSchema = z.string().email();

export const SigninContainer = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();

  const handleGoogleLogin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error('Signin failed', err);
    }
  }, [setUser]);

  const handleEmailLinkLogin = useCallback(async (email: string) => {
    const actionCodeSettings = {
      url: `http://localhost:3000/?email=${email}`,
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
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      signInWithEmailLink(auth, email as string, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          setUser(result.user);
        })
        .catch((err) => {
          console.error('Failed to sign in', err);
        });
    }
  }, [setUser]);

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
