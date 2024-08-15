import { useRef, useLayoutEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import { DebouncedFunc } from "lodash";

export default function useDebounced<T extends (...args: any[]) => any>(
  handler: T,
  ms: number,
  leading = false,
  trailing = true
): DebouncedFunc<T> {
  const handlerRef = useRef<T>();

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useMemo<DebouncedFunc<T>>(
    () =>
      debounce((...args: Parameters<T>) => handlerRef.current?.(...args), ms, {
        leading,
        trailing,
      }),
    [ms, leading, trailing]
  );
}
