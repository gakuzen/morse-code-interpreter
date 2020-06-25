import React, { useState, useEffect, useCallback } from "react";

import "./MorseCodeInterpreter.css";
import usePress from "../hooks/usePress";

const MorseCodeInterpreter = (props: any) => {
  const { isSocketConnected, socket } = props;

  const [input, setInput] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");

  const longPressThresholdInMs = 1500;
  const shortPressThresholdInMs = 1000;
  const idleThresholdInMs = 1500;

  useEffect(() => {
    const topic = "morse/output";

    if (socket) {
      socket.on(topic, (data: string) => {
        setInput("");
        if (data) {
          setInterpretation((i) => i + data);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off(topic);
      }
    };
  }, [socket]);

  const buttonPress = usePress(
    (ms: number) => {
      if (ms > longPressThresholdInMs) {
        setInput(input + "-");
        socket.emit("morse/input", "-");
      } else if (ms < shortPressThresholdInMs) {
        setInput(input + ".");
        socket.emit("morse/input", ".");
      }
    },
    () => {
      socket.emit("morse/input", "");
    },
    idleThresholdInMs
  );

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
