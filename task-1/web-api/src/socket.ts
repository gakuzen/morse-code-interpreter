import { morseCodeMap } from "./constants";

const setup = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log(`${socket.id} connected`);

    let inputStream: string = "";

    socket.on("morse/input", (data: any) => {
      switch (data) {
        case "-": {
          inputStream += data;
          break;
        }
        case ".": {
          inputStream += data;
          break;
        }
        default: {
          const morseCode = morseCodeMap[inputStream] || null;
          socket.emit("morse/output", morseCode);

          inputStream = "";
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};

export default setup;
