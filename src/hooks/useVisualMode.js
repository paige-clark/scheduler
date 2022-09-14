import { useState } from 'react';

export default function useVisualMode(initial) {
  const defaultMode = initial;
  const defaultHistory = [initial];
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    if (replace) {
      setMode(defaultMode);
      setHistory(defaultHistory);
    }
    setHistory((prev) => [...prev, newMode]);
    setMode(newMode);
  }

  function back() {
    const backArr = [...history];
    if (backArr.length > 1) {
      backArr.pop();
      setHistory(backArr);
      setMode(backArr[backArr.length - 1]);
    }
  }

  return { mode, transition, back };
}
