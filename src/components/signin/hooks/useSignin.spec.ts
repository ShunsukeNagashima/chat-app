import { renderHook, act } from '@testing-library/react';

import { useSignin } from './useSignin';

const mocks = {
  setUser: jest.fn(),
  push: jest.fn(),
  resetError: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(),
  signInWithEmailAndPassword: () => mocks.signInWithEmailAndPassword(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
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
  it('should signin', async () => {
    const mockResult = {
      user: {
        uid: 'test-uid',
        displayName: 'test-name',
        email: 'test@test.com',
        getIdToken: jest.fn().mockResolvedValue('test-id-token'),
      },
    };
    const { result } = renderHook(() => useSignin());
    mocks.signInWithEmailAndPassword.mockResolvedValue(mockResult);

    await act(async () => {
      await result.current.handleSignin({ email: 'test@test.com', password: 'test-password' });
    });

    expect(mocks.signInWithEmailAndPassword).toHaveBeenCalled();
    expect(mocks.resetError).toHaveBeenCalled();
    expect(mocks.setUser).toHaveBeenCalledWith(mockResult.user);
    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(result.current.isLoading).toBe(false);
  });
});
