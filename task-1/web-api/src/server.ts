import errorHandler from "errorhandler";

import app from "./app";
import setupSocket from "./socket";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const server = require("http").Server(app);
const io = require("socket.io")(server);

setupSocket(io);

server.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
