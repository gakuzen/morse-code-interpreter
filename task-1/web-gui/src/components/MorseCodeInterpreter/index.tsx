import React, { useState } from "react";

import "./MorseCodeInterpreter.css";
import usePress from "../../hooks/usePress";

const MorseCodeInterpreter = (props: any) => {
  const { socket } = props;

  const [input, setInput] = useState<string>("");
  const [interpretation, setInterpretation] = useState<string>("");

  const longPressMsThreshold = 1500;
  const shortPressMsThreshold = 1000;
  const idleMsThreshold = 1500;

  const buttonPress = usePress((idleAfterPress: boolean, ms?: number) => {
    if (ms) {
      if (ms > longPressMsThreshold) {
        console.log("-");
        setInput(input + "-");
        socket.emit("morse/input", "-");
      } else if (ms < shortPressMsThreshold) {
        console.log(".");
        setInput(input + ".");
        socket.emit("morse/input", ".");
      }
    } else if (idleAfterPress) {
      socket.emit("morse/input", "");
    }
  }, idleMsThreshold);

  socket.on("morse/output", (data: any) => {
    setInput("");
    if (data) {
      setInterpretation(interpretation + data);
    }
  });

  return (
    <div>
      <p className="banner">
        <b>I love Morse code</b>
      </p>
      <div className="input-group">
        <button {...buttonPress}>Morse it</button>
      </div>
      <p className="morse-code">{input}</p>
      <p className="interpretation">{interpretation}</p>
    </div>
  );
};

export default MorseCodeInterpreter;
