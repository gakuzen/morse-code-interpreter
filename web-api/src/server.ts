import errorHandler from "errorhandler";

import app from "./app";
import setupSocket from "./socket";
import logger from "./util/logger";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const server = require("http").Server(app);
const io = require("socket.io")(server);

setupSocket(io);

server.listen(app.get("port"), () => {
  logger.info(
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`
  );
  logger.info("Press CTRL-C to stop");
});

export default server;
