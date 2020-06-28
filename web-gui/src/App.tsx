import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import "./App.css";
import MorseCodeInterpreter from "./components/MorseCodeInterpreter";
import config from "./config";

const App = (): JSX.Element => {
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [socket, setSocket] = useState<any>();

  useEffect((): (() => void) => {
    const socketIO: SocketIOClient.Socket = io(config.socketUrl);

    socketIO.on("connect", (): void => {
      setIsSocketConnected(true);
    });

    socketIO.on("disconnect", (): void => {
      setIsSocketConnected(false);
    });

    setSocket(socketIO);

    return (): void => {
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
