import { useState, useEffect, useCallback } from "react";

export default function usePress(
  callback = (idleAfterPress: boolean, ms?: number) => {},
  idleMsThreshold: number = 1500
) {
  const [startPress, setStartPress] = useState<boolean>(false);
  const [lastPressStart, setLastPressStart] = useState<Date>();

  useEffect(() => {
    let idleTimerId: any;

    if (startPress) {
      clearTimeout(idleTimerId);
    } else {
      const pressedDuration =
        new Date().getTime() - (lastPressStart || new Date()).getTime();
      callback(false, pressedDuration);

      if (lastPressStart) {
        idleTimerId = setTimeout(() => {
          callback(true);
        }, idleMsThreshold);
      }
    }

    return () => {
      clearTimeout(idleTimerId);
    };
  }, [startPress]);

  const start = useCallback(() => {
    setStartPress(true);
    setLastPressStart(new Date());
  }, []);
  const stop = useCallback(() => {
    setStartPress(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
