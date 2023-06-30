import { useCallback, useEffect, useState } from 'react';

import { useBoolean } from '../useBoolean';

export type FetchHookOptions<TData> = {
  enabled?: boolean;
  initialData?: TData;
};

export const useFetch = <TData>(
  fn: () => TData | Promise<TData>,
  options: FetchHookOptions<TData> = {},
) => {
  const { initialData = null, enabled = true } = options;

  const [data, setData] = useState<TData | null>(initialData);
  const [loading, { on: startLoading, off: finishLoading }] = useBoolean(false);

  const fetch = useCallback(async () => {
    if (enabled) {
      startLoading();
      try {
        const data = await fn();
        setData(data);
      } finally {
        finishLoading();
      }
    }
  }, [fn, startLoading, finishLoading, enabled]);

  useEffect(() => {
    if (enabled) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { data, loading, refetch: fetch };
};
