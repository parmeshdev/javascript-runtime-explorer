import { useEffect, useMemo, useRef, useState } from "react";
import type { AreaKey, Example, Step } from "./examples";

type Token = { id: string; text: string; color?: string };
export type RuntimeState = {
  stack: Token[];
  webapi: Token[];
  micro: Token[];
  macro: Token[];
  network: Token[];
  console: Token[];
};

const empty = (): RuntimeState => ({
  stack: [],
  webapi: [],
  micro: [],
  macro: [],
  network: [],
  console: [],
});

function applyStep(state: RuntimeState, step: Step): RuntimeState {
  const s: RuntimeState = {
    stack: [...state.stack],
    webapi: [...state.webapi],
    micro: [...state.micro],
    macro: [...state.macro],
    network: [...state.network],
    console: [...state.console],
  };
  const actionToMake = step?.action;
  const removeFrom = (area: AreaKey, id: string) => {
    s[area] = s[area].filter((t) => t.id !== id);
  };
  switch (actionToMake?.type) {
    case "push":
      s[actionToMake?.area] = [
        ...s[actionToMake?.area],
        { id: actionToMake?.id, text: actionToMake?.text, color: actionToMake?.color },
      ];
      break;
    case "pop":
      removeFrom(actionToMake?.area, actionToMake?.id);
      break;
    case "move":
      removeFrom(actionToMake?.from, actionToMake?.id);
      s[actionToMake?.to] = [
        ...s[actionToMake?.to],
        { id: actionToMake?.id, text: actionToMake?.text, color: actionToMake?.color },
      ];
      break;
    case "log":
      s.console = [
        ...s.console,
        { id: `log-${s.console.length}-${actionToMake?.text}`, text: actionToMake?.text },
      ];
      break;
    case "tick":
      break;
  }
  return s;
}

export function useRuntimeSim(example: Example) {
  const [index, setIndex] = useState(0); // number of steps applied
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | null>(null);

  const state = useMemo(() => {
    let s = empty();
    for (let i = 0; i < index; i++) s = applyStep(s, example.steps[i]);
    return s;
  }, [example, index]);

  const currentStep: Step | null = index > 0 ? example.steps[index - 1] : null;
  const activeLine = currentStep?.line;

  const reset = () => {
    setPlaying(false);
    setIndex(0);
  };

  // Reset when example changes
  useEffect(() => {
    reset(); /* eslint-disable-next-line */
  }, [example.id]);

  const step = () => {
    setIndex((i) => Math.min(i + 1, example.steps.length));
  };

  useEffect(() => {
    if (!playing) {
      if (timer.current) window.clearTimeout(timer.current);
      return;
    }
    if (index >= example.steps.length) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      setIndex((i) => i + 1);
    }, 900 / speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, index, speed, example.steps.length]);

  return {
    state,
    activeLine,
    currentStep,
    playing,
    speed,
    progress: { current: index, total: example.steps.length },
    play: () => {
      if (index >= example.steps.length) setIndex(0);
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    reset,
    step,
    setSpeed,
  };
}
