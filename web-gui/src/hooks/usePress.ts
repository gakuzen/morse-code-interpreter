import { useState, useEffect, useCallback } from "react";

export default function usePress(
  onPressRelease: (ms: number) => void,
  onIdle: () => void,
  idleThresholdInMs: number
) {
  const [startPress, setStartPress] = useState<boolean>(false);
  const [lastPressStart, setLastPressStart] = useState<Date>();

  useEffect((): (() => void) => {
    let idleTimerId: NodeJS.Timeout | undefined;

    if (startPress) {
      if (idleTimerId) {
        clearTimeout(idleTimerId);
      }
    } else {
      if (lastPressStart) {
        const pressedDuration: number =
          new Date().getTime() - lastPressStart.getTime();

        onPressRelease(pressedDuration);

        idleTimerId = setTimeout((): void => {
          onIdle();
        }, idleThresholdInMs);
      }
    }

    return (): void => {
      if (idleTimerId) {
        clearTimeout(idleTimerId);
      }
    };
  }, [startPress, lastPressStart, onPressRelease, onIdle, idleThresholdInMs]);

  const start: () => void = useCallback((): void => {
    setStartPress(true);
    setLastPressStart(new Date());
  }, []);
  const stop: () => void = useCallback((): void => {
    setStartPress(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
  };
}
