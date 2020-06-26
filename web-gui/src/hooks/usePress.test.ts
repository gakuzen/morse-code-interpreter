import { renderHook, act } from "@testing-library/react-hooks";

import usePress from "./usePress";
import { sleep } from "../utils";

describe("test usePress", () => {
  const idleThresholdInMs = 1500;

  test("should press", async () => {
    const pressDurationInMs = 1234;

    let isIdle;
    let pressedDurationInMs;

    const { result } = renderHook(() =>
      usePress(
        (ms: number) => {
          pressedDurationInMs = ms;
          isIdle = false;
        },
        () => {
          isIdle = true;
        },
        idleThresholdInMs
      )
    );

    await act(async () => {
      result.current.onMouseDown();
      await sleep(pressDurationInMs);
      result.current.onMouseUp();
    });

    expect(isIdle).toBe(false);
    expect(pressedDurationInMs).toBeGreaterThanOrEqual(pressDurationInMs);
  });

  test("should idle", async () => {
    let isIdle;

    const { result } = renderHook(() =>
      usePress(
        (ms: number) => {
          isIdle = false;
        },
        () => {
          isIdle = true;
        },
        idleThresholdInMs
      )
    );

    act(() => {
      result.current.onMouseDown();
      result.current.onMouseUp();
    });

    await sleep(idleThresholdInMs);

    expect(isIdle).toBe(true);
  });
});
