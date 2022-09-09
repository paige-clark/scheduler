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

/*
To pass the first test our useVisualMode Hook will need to:

take in an initial mode
set the mode state with the initial mode provided
return an object with a mode property
*/
