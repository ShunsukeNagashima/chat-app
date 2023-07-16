import { renderHook, act } from '@testing-library/react';
import ky from 'ky';
import { HTTPError } from 'ky';

import { useErrorHandler } from './useErrorHandler';

jest.mock('ky', () => ({
  HTTPError: jest.fn(),
}));

describe('useErrorHandler', () => {
  let originalConsoleError: typeof console.error;
  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  it('should be false by default', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.hasError).toBe(false);
  });

  it('should set hasError to true', async () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error());
    });

    expect(console.error).toHaveBeenCalled();

    expect(result.current.hasError).toBe(true);
  });

  it('should resetError', async () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError(new Error());
    });

    expect(console.error).toHaveBeenCalled();

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.resetError();
    });

    expect(result.current.hasError).toBe(false);
  });
});
