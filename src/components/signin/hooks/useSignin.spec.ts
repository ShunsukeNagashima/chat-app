import { renderHook, act } from '@testing-library/react';
import dayjs from 'dayjs';

import { useSignin } from './useSignin';

import { User } from '@/domain/models/user';

const mocks = {
  setUser: jest.fn(),
  push: jest.fn(),
  resetError: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  fetchById: jest.fn(),
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
    ...jest.requireActual('@/hooks/useErrorHandler/useErrorHandler'),
    resetError: mocks.resetError,
    handleError: jest.fn(),
  }),
}));

jest.mock('@/repository/user/user-repository', () => ({
  userRepository: {
    fetchById: () => mocks.fetchById(),
  },
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

    const mockUser: User = {
      id: 'test-id',
      name: 'test-name',
      email: 'test@test.com',
      profileImageUrl: 'test-profile-image-url',
      createdAt: dayjs('2023-01-01'),
    };

    mocks.signInWithEmailAndPassword.mockResolvedValue(mockResult);
    mocks.fetchById.mockResolvedValue(mockUser);

    const { result } = renderHook(() => useSignin());

    await act(async () => {
      await result.current.handleSignin({ email: 'test@test.com', password: 'test-password' });
    });

    expect(mocks.signInWithEmailAndPassword).toHaveBeenCalled();
    expect(mocks.fetchById).toHaveBeenCalled();
    expect(mocks.resetError).toHaveBeenCalled();
    expect(mocks.setUser).toHaveBeenCalledWith(mockUser);
    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(result.current.isLoading).toBe(false);
  });
});
