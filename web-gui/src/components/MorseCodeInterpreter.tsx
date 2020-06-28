import React, { useState, useEffect, useCallback } from "react";

import "./MorseCodeInterpreter.css";
import usePress from "../hooks/usePress";

export interface MorseCodeInterpreterProps {
  isSocketConnected: boolean;
  socket: SocketIOClient.Socket | null;
}

const MorseCodeInterpreter = (
  props: MorseCodeInterpreterProps
): JSX.Element => {
  const { isSocketConnected, socket } = props;

  const [input, setInput] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");

  const longPressThresholdInMs: number = 1500;
  const shortPressThresholdInMs: number = 1000;
  const idleThresholdInMs: number = 1500;

  useEffect((): (() => void) => {
    const topic: string = "morse/output";

    if (socket) {
      socket.on(topic, (data: string): void => {
        setInput("");
        if (data) {
          setInterpretation(
            (interpretation: string): string => interpretation + data
          );
        }
      });
    }

    return (): void => {
      if (socket) {
        socket.off(topic);
      }
    };
  }, [socket]);

  const onPressRelease: (ms: number) => void = useCallback(
    (ms: number): void => {
      if (ms > longPressThresholdInMs) {
        setInput((input: string): string => input + "-");
        if (socket) {
          socket.emit("morse/input", "-");
        }
      } else if (ms < shortPressThresholdInMs) {
        setInput((input: string): string => input + ".");
        if (socket) {
          socket.emit("morse/input", ".");
        }
      }
    },
    [socket]
  );

  const onIdle: () => void = useCallback((): void => {
    if (socket) {
      socket.emit("morse/input", "");
    }
  }, [socket]);

  const buttonPress = usePress(onPressRelease, onIdle, idleThresholdInMs);

  return (
    <div>
      <p className="banner">
        <b>I love Morse code</b>
      </p>
      <div className="input-group">
        <button disabled={!isSocketConnected} {...buttonPress}>
          Morse it
        </button>
      </div>
      {!isSocketConnected && (
        <p className="error-message">can not connect to backend socket</p>
      )}
      <p className="morse-code">{input}</p>
      <p className="interpretation">{interpretation}</p>
    </div>
  );
};

export default MorseCodeInterpreter;
