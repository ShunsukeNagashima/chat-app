import { renderHook, waitFor, act } from '@testing-library/react';
import dayjs from 'dayjs';

import { useAuth } from './useAuth';

const mocks = {
  signOut: jest.fn(),
  disconnect: jest.fn(),
  connect: jest.fn(),
  wsInstance: jest.fn(),
  user: jest.fn(),
  setUser: jest.fn(),
  push: jest.fn(),
  fetchById: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: (path: string) => mocks.push(path),
  }),
}));

jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    user: mocks.user(),
    setUser: mocks.setUser,
  }),
}));

jest.mock('@/store/websocket-store', () => ({
  useWebSocketStore: () => ({
    wsInstance: mocks.wsInstance(),
    connect: mocks.connect,
    disconnect: mocks.disconnect,
  }),
}));

jest.mock('firebase/auth', () => {
  let callback: (arg: any) => void;
  return {
    getAuth: jest.fn(),
    signOut: () => mocks.signOut(),
    onAuthStateChanged: jest.fn((_, cb) => {
      callback = cb;
      return () => {};
    }),
    triggerAuthChange: (user: any) => {
      callback(user);
    },
  };
});

jest.mock('@/repository/user/user-repository', () => ({
  userRepository: {
    fetchById: () => mocks.fetchById(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logout', () => {
    it('should disconnect websocket', async () => {
      mocks.wsInstance.mockReturnValue('not null');
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        result.current.logout();
      });

      expect(mocks.disconnect).toHaveBeenCalled();
    });

    it('should not disconnect websocket if wsInstance is null', async () => {
      mocks.wsInstance.mockReturnValue(null);
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        result.current.logout();
      });

      expect(mocks.disconnect).not.toHaveBeenCalled();
    });

    it('should call signOut', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        result.current.logout();
      });

      expect(mocks.signOut).toHaveBeenCalled();
    });
  });

  describe('onAuthStateChanged', () => {
    const firebaseAuth = require('firebase/auth');

    it('should redirect when user is not authenticated', async () => {
      mocks.wsInstance.mockReturnValue('not null');
      renderHook(() => useAuth());

      act(() => {
        firebaseAuth.triggerAuthChange(null);
      });

      expect(mocks.push).toHaveBeenCalledWith('/signin');
      expect(mocks.disconnect).toHaveBeenCalled();
    });

    it('should connect websocket when user is not null', async () => {
      renderHook(() => useAuth());
      const authUser = { uid: 'testUid' };

      const mockUser = {
        id: 'test-id',
        name: 'test-name',
        email: 'test@test.com',
        profileImageUrl: 'test-profile-image-url',
        createdAt: dayjs('2023-01-01'),
      };

      mocks.fetchById.mockResolvedValue(mockUser);

      act(() => {
        firebaseAuth.triggerAuthChange(authUser);
      });

      await waitFor(() => {
        expect(mocks.fetchById).toHaveBeenCalled();
      });
      expect(mocks.setUser).toHaveBeenCalled();
      expect(mocks.connect).toHaveBeenCalled();
    });
  });
});
