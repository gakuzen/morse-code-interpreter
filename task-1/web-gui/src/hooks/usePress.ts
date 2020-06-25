import { useState, useEffect, useCallback } from "react";

export default function usePress(
  onPressRelease: (ms: number) => void,
  onIdle: () => void,
  idleThresholdInMs: number
) {
  const [startPress, setStartPress] = useState<boolean>(false);
  const [lastPressStart, setLastPressStart] = useState<Date>();

  useEffect(() => {
    let idleTimerId: any;

    if (startPress) {
      clearTimeout(idleTimerId);
    } else {
      if (lastPressStart) {
        const pressedDuration: number =
          new Date().getTime() - lastPressStart.getTime();

        onPressRelease(pressedDuration);

        idleTimerId = setTimeout(() => {
          onIdle();
        }, idleThresholdInMs);
      }
    }

    return () => {
      clearTimeout(idleTimerId);
    };
  }, [startPress, lastPressStart]);

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
