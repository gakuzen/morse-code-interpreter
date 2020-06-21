import errorHandler from "errorhandler";

import app from "./app";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

const server = require("http").Server(app);
const io = require("socket.io")(server);

server.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

const morseCodeMap: { [code: string]: string } = {
  ".-": "A",
  "-...": "B",
  "-.-.": "C",
  "-..": "D",
  ".": "E",
  "..-.": "F",
  "--.": "G",
  "....": "H",
  "..": "I",
  ".---": "J",
  "-.-": "K",
  ".-..": "L",
  "--": "M",
  "-.": "N",
  "---": "O",
  ".--.": "P",
  "--.-": "Q",
  ".-.": "R",
  "...": "S",
  "-": "T",
  "..-": "U",
  "...-": "V",
  ".--": "W",
  "-..-": "X",
  "-.--": "Y",
  "--..": "Z",
};

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
    console.log("user disconnected");
  });
});

export default server;
