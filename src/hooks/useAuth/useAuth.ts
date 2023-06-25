import { useEffect, useCallback } from 'react';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { firebaseApp } from '@/lib/firebase-client';
import { useAuthStore } from '@/store/auth-store';

const auth = getAuth(firebaseApp);

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Failed to logout', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        router.push('/signin');
      } else {
        setUser(authUser);
      }
    });

    return () => unsubscribe();
  }, [router, setUser]);

  return { user, logout };
};
