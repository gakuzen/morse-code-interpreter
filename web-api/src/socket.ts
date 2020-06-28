import { morseCodeMap } from "./constants";
import logger from "./util/logger";

const setup = (io: SocketIO.Server): void => {
  io.on("connection", (socket: SocketIO.Socket): void => {
    logger.debug(`${socket.id} connected`);

    let inputStream: string = "";

    socket.on("morse/input", (data: string): void => {
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
          const morseCode: string | null = morseCodeMap[inputStream] || null;
          socket.emit("morse/output", morseCode);

          inputStream = "";
        }
      }
    });

    socket.on("disconnect", (): void => {
      logger.debug(`${socket.id} disconnected`);
    });
  });
};

export default setup;
