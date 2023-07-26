import { renderHook, act, RenderHookResult } from '@testing-library/react';

import { useSignin } from './useSignin';

const mocks = {
  setUser: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  routerPush: jest.fn(),
  resetError: jest.fn(),
};

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: () => mocks.signInWithEmailAndPassword,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.routerPush,
  }),
}));

jest.mock('@/repository/user/user-repository', () => ({
  userRepository: {
    create: jest.fn(),
  },
}));

jest.mock('@/store/auth-store', () => ({
  useAuthStore: () => ({
    setUser: mocks.setUser,
  }),
}));

jest.mock('@/hooks/useErrorHandler/useErrorHandler', () => ({
  useErrorHandler: () => ({
    resetError: mocks.resetError,
  }),
}));

describe('useSignin', () => {
  it('should register user', async () => {
    const mockUser = {
      user: {
        uid: 'test-uid',
        displayName: 'test-name',
        email: 'test@test.com',
        getIdToken: jest.fn().mockResolvedValue('test-id-token'),
      },
    };
    const { result } = renderHook(() => useSignin());
    mocks.signInWithEmailAndPassword.mockResolvedValue(mockUser);

    await act(async () => {
      await result.current.handleSignin({ email: 'test@test.com', password: 'test-password' });
    });

    expect(mocks.resetError).toHaveBeenCalled();
    expect(mocks.setUser).toHaveBeenCalled();
    expect(mocks.routerPush).toHaveBeenCalledWith('/');
    expect(result.current.isLoading).toBe(false);
  });
});
