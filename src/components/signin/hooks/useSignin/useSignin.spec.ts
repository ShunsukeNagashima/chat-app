import { renderHook, act, RenderHookResult } from '@testing-library/react';

import { useSignin } from './useSignin';

import { userRepository } from '@/repository/user/user-repository';

const mocks = {
  setUser: jest.fn(),
};

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn().mockResolvedValue({
    user: {
      uid: 'test-uid',
      displayName: 'test-name',
      email: 'test@test.com',
      getIdToken: jest.fn().mockResolvedValue('test-id-token'),
    },
  }),
  sendSignInLinkToEmail: jest.fn(),
  isSignInWithEmailLink: jest.fn(),
  signInWithEmailLink: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
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

describe('useSignin', () => {
  describe('handleGoogleLogin', () => {
    it('should register user', async () => {
      const { result } = renderHook(() => useSignin());

      await act(async () => {
        await result.current.handleGoogleLogin();
      });

      expect(userRepository.create).toHaveBeenCalled();
      expect(mocks.setUser).toHaveBeenCalled();
    });
  });

  describe('handleSubmit', () => {
    const firebaseAuth = require('firebase/auth');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should prevent form event default action', () => {
      const { result } = renderHook(() => useSignin());

      const mockPreventDefault = jest.fn();
      const event = { preventDefault: mockPreventDefault } as any;

      act(() => {
        result.current.handleSubmit(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('should set error when email is invalid', async () => {
      const { result } = renderHook(() => useSignin());
      const event = {
        target: { value: 'invalid email' },
        preventDefault: jest.fn(),
      } as any;

      act(() => {
        result.current.handleChange(event);
      });

      act(() => {
        result.current.handleSubmit(event);
      });

      expect(result.current.error).toEqual('Invalid email address');
    });

    it('should call handleEmailLogin if email is valid', () => {
      const { result } = renderHook(() => useSignin());
      const event = {
        target: { value: 'valid-email@test.com' },
        preventDefault: jest.fn(),
      } as any;
      act(() => {
        result.current.handleChange(event);
      });

      act(() => {
        result.current.handleSubmit(event);
      });

      expect(firebaseAuth.sendSignInLinkToEmail).toHaveBeenCalledWith(
        firebaseAuth.getAuth(),
        'valid-email@test.com',
        expect.objectContaining({
          url: expect.stringContaining('valid-email@test.com'),
          handleCodeInApp: true,
        }),
      );
    });
  });
});
