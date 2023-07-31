import { useEffect, useCallback } from 'react';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { useErrorHandler } from '../useErrorHandler';

import { User } from '@/domain/models/user';
import { firebaseApp } from '@/lib/firebase-client';
import { userRepository } from '@/repository/user/user-repository';
import { useAuthStore } from '@/store/auth-store';
import { useWebSocketStore } from '@/store/websocket-store';

const auth = getAuth(firebaseApp);

export const useAuth = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { wsInstance, connect, disconnect } = useWebSocketStore();
  const { handleError } = useErrorHandler();

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
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
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          userRepository
            .fetchById({ userId: authUser.uid })
            .then((user) => {
              setUser(user);
              localStorage.setItem('user', JSON.stringify(user));
            })
            .catch((err) => {
              handleError(new Error('Failed to fetch user', err));
            });
        } else {
          const user = JSON.parse(storedUser) as User;
          setUser(user);
        }
        if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) {
          connect(`ws://${process.env.NEXT_PUBLIC_API_HOST}/ws`);
        }
      }
    });

    return () => unsubscribe();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, setUser, connect, disconnect]);

  return { logout };
};
