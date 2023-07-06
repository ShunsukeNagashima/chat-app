import { useEffect, useCallback } from 'react';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { firebaseApp } from '@/lib/firebase-client';
import { useAuthStore } from '@/store/auth-store';
import { useWebSocketStore } from '@/store/websocket-store';

const auth = getAuth(firebaseApp);

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { wsInstance, connect, disconnect } = useWebSocketStore();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      if (wsInstance) disconnect();
    } catch (err) {
      console.error('Failed to logout', err);
    }
  }, [disconnect, wsInstance]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        router.push('/signin');
        if (wsInstance) disconnect();
      } else {
        setUser(authUser);
        console.log(wsInstance);
        if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) {
          connect(`ws://${process.env.NEXT_PUBLIC_API_HOST}/ws`);
        }
      }
    });

    return () => unsubscribe();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setUser, connect, disconnect]);

  return { user, logout };
};
