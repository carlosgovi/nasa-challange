import { useState } from "react";

function useLocalStorageArray(key: any, initialValue = []) {
  const initial =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem(key) as any) || initialValue
      : initialValue;

  const [array, setArray] = useState(initial);

  const updateArray = (newArray: any) => {
    setArray(newArray);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(newArray));
    }
  };

  return [array, updateArray];
}

export { useLocalStorageArray };
