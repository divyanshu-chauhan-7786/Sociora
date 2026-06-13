import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const updateValue = useCallback(
    (nextValue: T | ((currentValue: T) => T)) => {
      setValue((currentValue) =>
        nextValue instanceof Function ? nextValue(currentValue) : nextValue,
      );
    },
    [],
  );

  return [value, updateValue] as const;
};
