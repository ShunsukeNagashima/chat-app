import { useCallback, useMemo, useState } from 'react';

export type BooleanHookResult = [
  boolean,
  {
    on: () => void;
    off: () => void;
    toggle: () => void;
  },
];

export const useBoolean = (initialValue = false): BooleanHookResult => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const on = useCallback(() => {
    setValue(true);
  }, []);

  const off = useCallback(() => {
    setValue(false);
  }, []);

  const context = useMemo(() => {
    return {
      on,
      off,
      toggle,
    };
  }, [on, off, toggle]);

  return [value, context];
};
