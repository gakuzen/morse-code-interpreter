import { morseCodeMap } from "./constants";
import logger from "./util/logger";

const setup = (io: SocketIO.Server) => {
  io.on("connection", (socket: SocketIO.Socket) => {
    logger.debug(`${socket.id} connected`);

    let inputStream: string = "";

    socket.on("morse/input", (data: string) => {
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
      logger.debug(`${socket.id} disconnected`);
    });
  });
};

export default setup;
