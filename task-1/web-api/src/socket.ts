import { morseCodeMap } from "./constants";
import logger from "./util/logger";

const setup = (io: any) => {
  io.on("connection", (socket: any) => {
    logger.debug(`${socket.id} connected`);

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
      logger.debug(`${socket.id} disconnected`);
    });
  });
};

export default setup;
