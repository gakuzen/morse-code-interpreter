import { renderHook, act } from "@testing-library/react-hooks";

import usePress from "./usePress";
import { sleep } from "../utils";

describe("test usePress", (): void => {
  const idleThresholdInMs: number = 1500;

  test("should press", async (): Promise<void> => {
    const pressDurationInMs: number = 1234;

    let isIdle: boolean | undefined;
    let pressedDurationInMs: number | undefined;

    const { result } = renderHook(() =>
      usePress(
        (ms: number): void => {
          pressedDurationInMs = ms;
          isIdle = false;
        },
        (): void => {
          isIdle = true;
        },
        idleThresholdInMs
      )
    );

    await act(
      async (): Promise<void> => {
        result.current.onMouseDown();
        await sleep(pressDurationInMs);
        result.current.onMouseUp();
      }
    );

    expect(isIdle).toBe(false);
    expect(pressedDurationInMs).toBeGreaterThanOrEqual(pressDurationInMs);
  });

  test("should idle", async (): Promise<void> => {
    let isIdle: boolean | undefined;

    const { result } = renderHook(() =>
      usePress(
        (ms: number): void => {
          isIdle = false;
        },
        (): void => {
          isIdle = true;
        },
        idleThresholdInMs
      )
    );

    act((): void => {
      result.current.onMouseDown();
      result.current.onMouseUp();
    });

    await sleep(idleThresholdInMs);

    expect(isIdle).toBe(true);
  });
});
