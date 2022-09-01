import { useEffect, useState } from "react";

function useLocalStorage(key, initialValue) {
  const fullKey = `messanger-${key}`;
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(fullKey);
    if (jsonValue !== null) return JSON.parse(jsonValue);
    if (typeof initialValue === "function") {
      return initialValue();
    } else return initialValue;
  });
  useEffect(() => {
    localStorage.setItem(fullKey, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
export default useLocalStorage;
