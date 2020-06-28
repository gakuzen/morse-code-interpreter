import io from "socket.io-client";

import config from "../src/config";
import { morseCodeMap } from "../src/constants";

describe("Socket unit tests", function () {
  let socket: SocketIOClient.Socket;

  beforeAll(function (done) {
    // Setup
    socket = io.connect(`http://localhost:${config.port}`);
    socket.on("connect", function () {
      done();
    });
    socket.on("disconnect", function () {});
  });

  afterAll(function (done) {
    // Cleanup
    if (socket) {
      socket.disconnect();
    }
    done();
  });

  describe("Interpret Morse code", function () {
    const inputTopic: string = "morse/input";
    const outputTopic: string = "morse/output";

    const tester = (combination: string, expected: string, done: any): void => {
      socket.on(outputTopic, (data: string): void => {
        socket.off(outputTopic);

        expect(data).toEqual(expected);

        done();
      });

      for (const morseCode of Array.from(combination)) {
        socket.emit(inputTopic, morseCode);
      }
      socket.emit(inputTopic, "");
    };

    Object.entries(morseCodeMap).forEach(
      ([comb, char]: [string, string]): void => {
        it(`Interpret ${comb}`, function (done) {
          tester(comb, char, done);
        });
      }
    );
  });
});
