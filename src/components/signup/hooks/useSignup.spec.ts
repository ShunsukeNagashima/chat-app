import { renderHook, act } from '@testing-library/react';

import { useSignup } from './useSignup';

const mocks = {
  setUser: jest.fn(),
  push: jest.fn(),
  resetError: jest.fn(),
  create: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: () => mocks.createUserWithEmailAndPassword(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mocks.push,
  }),
}));

jest.mock('@/repository/user/user-repository', () => ({
  userRepository: {
    create: () => mocks.create(),
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
    handleError: jest.fn(),
  }),
}));

describe('useSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register user', async () => {
    const mockResult = {
      user: {
        uid: 'test-uid',
        displayName: 'test-name',
        email: 'test@test.com',
        getIdToken: jest.fn().mockResolvedValue('test-id-token'),
      },
    };
    const { result } = renderHook(() => useSignup());

    mocks.createUserWithEmailAndPassword.mockResolvedValue(mockResult);

    await act(async () => {
      await result.current.handleSignup({
        userName: 'test-user',
        email: 'test@test.com',
        password: 'test-password',
      });
    });

    expect(mocks.createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(mocks.create).toHaveBeenCalled();
    expect(mocks.resetError).toHaveBeenCalled();
    expect(mocks.setUser).toHaveBeenCalledWith(mockResult.user);
    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(result.current.isLoading).toBe(false);
  });
});
