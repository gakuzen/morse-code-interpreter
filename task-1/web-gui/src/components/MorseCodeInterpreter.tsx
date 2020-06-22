import React, { useState, useEffect, useCallback } from "react";

import "./MorseCodeInterpreter.css";
import usePress from "../hooks/usePress";

const MorseCodeInterpreter = (props: any) => {
  const { isSocketConnected, socket } = props;

  const [input, setInput] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");

  const longPressMsThreshold = 1500;
  const shortPressMsThreshold = 1000;
  const idleMsThreshold = 1500;

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

  const buttonPress = usePress((idleAfterPress: boolean, ms?: number) => {
    if (ms) {
      if (ms > longPressMsThreshold) {
        setInput(input + "-");
        socket.emit("morse/input", "-");
      } else if (ms < shortPressMsThreshold) {
        setInput(input + ".");
        socket.emit("morse/input", ".");
      }
    } else if (idleAfterPress) {
      socket.emit("morse/input", "");
    }
  }, idleMsThreshold);

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
