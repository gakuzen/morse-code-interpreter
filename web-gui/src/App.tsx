import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";
import MorseCodeInterpreter from "./components/MorseCodeInterpreter";
import config from "./config";

const App = () => {
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [socket, setSocket] = useState<any>();

  useEffect(() => {
    const socketIO = io(config.socketUrl);

    socketIO.on("connect", () => {
      setIsSocketConnected(true);
    });

    socketIO.on("disconnect", () => {
      setIsSocketConnected(false);
    });

    setSocket(socketIO);

    return () => {
      socketIO.disconnect();
    };
  }, []);

  return (
    <div>
      <MorseCodeInterpreter
        isSocketConnected={isSocketConnected}
        socket={socket}
      ></MorseCodeInterpreter>
    </div>
  );
};

export default App;
