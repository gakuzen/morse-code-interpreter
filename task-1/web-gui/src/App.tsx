import React from "react";
import io from "socket.io-client";

import logo from "./logo.svg";
import "./App.css";
import MorseCodeInterpreter from "./components/MorseCodeInterpreter";

function App() {
  const socket = io("http://localhost:3000");

  socket.on("connect", (data: any) => {
    console.log("connect");
  });

  socket.on("disconnect", (data: any) => {
    console.log("disconnect");
  });

  socket.on("morse/output", (data: any) => {
    console.log("morse/output", data);
  });

  return (
    <div>
      <MorseCodeInterpreter socket={socket}></MorseCodeInterpreter>
    </div>
  );
}

export default App;
