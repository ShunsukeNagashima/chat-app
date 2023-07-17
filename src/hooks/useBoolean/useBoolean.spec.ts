import { renderHook, act } from '@testing-library/react';

import { useBoolean } from './useBoolean';

describe('useBoolean', () => {
  it('should be false by default', () => {
    const { result } = renderHook(() => useBoolean());

    expect(result.current[0]).toBe(false);
  });

  it('should be true when on is called', () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current[1].on();
    });

    expect(result.current[0]).toBe(true);
  });

  it('should be false when off is called', () => {
    const { result } = renderHook(() => useBoolean(true));

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].off();
    });

    expect(result.current[0]).toBe(false);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useBoolean());

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].toggle();
    });

    expect(result.current[0]).toBe(false);
  });
});
