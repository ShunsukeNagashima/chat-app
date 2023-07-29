import { renderHook, act } from '@testing-library/react';
import dayjs from 'dayjs';

import { useSignup } from './useSignup';

const mocks = {
  setUser: jest.fn(),
  push: jest.fn(),
  resetError: jest.fn(),
  create: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  getDownloadURL: jest.fn(),
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: () => mocks.createUserWithEmailAndPassword(),
}));

jest.mock('firebase/storage', () => ({
  ...jest.requireActual('firebase/storage'),
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: () => mocks.getDownloadURL(),
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

    const mockUser = {
      id: 'test-uid',
      name: 'test-name',
      email: 'test@test.com',
      profileImage: 'test-url',
      createdAt: dayjs('2023-01-01'),
    };
    const { result } = renderHook(() => useSignup());

    mocks.getDownloadURL.mockResolvedValue('test-url');
    mocks.createUserWithEmailAndPassword.mockResolvedValue(mockResult);
    mocks.create.mockResolvedValue(mockUser);

    await act(async () => {
      await result.current.handleSignup({
        userName: 'test-user',
        email: 'test@test.com',
        password: 'test-password',
        profileImage: new File(['test'], 'test.png', { type: 'image/png' }),
      });
    });

    expect(mocks.createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(mocks.create).toHaveBeenCalled();
    expect(mocks.resetError).toHaveBeenCalled();
    expect(mocks.setUser).toHaveBeenCalledWith(mockUser);
    expect(mocks.push).toHaveBeenCalledWith('/');
    expect(result.current.isLoading).toBe(false);
  });
});
