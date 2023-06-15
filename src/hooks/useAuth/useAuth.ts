import { useEffect } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { firebaseApp } from '@/lib/firebase-client';
import { useAuthStore } from '@/store/auth-store';

const auth = getAuth(firebaseApp);

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

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

  return { user };
};
