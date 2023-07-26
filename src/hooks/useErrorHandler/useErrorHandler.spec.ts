import { renderHook, act } from '@testing-library/react';
import ky from 'ky';
import { HTTPError } from 'ky';

import { useErrorHandler } from './useErrorHandler';

jest.mock('ky', () => ({
  HTTPError: jest.fn(),
}));

describe('useErrorHandler', () => {
  it('should be false by default', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toEqual('');
  });

  it('should set hasError to true', async () => {
    const { result } = renderHook(() => useErrorHandler());

    const errMsg = 'Error Occured';

    act(() => {
      result.current.handleError(new Error(errMsg));
    });

    expect(result.current.error).toEqual(errMsg);
  });

  it('should resetError', async () => {
    const { result } = renderHook(() => useErrorHandler());

    const errMsg = 'Error Occured';

    act(() => {
      result.current.handleError(new Error(errMsg));
    });

    expect(result.current.error).toEqual(errMsg);

    act(() => {
      result.current.resetError();
    });

    expect(result.current.error).toEqual('');
  });
});
