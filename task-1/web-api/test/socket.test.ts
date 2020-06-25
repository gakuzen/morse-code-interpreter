import io from "socket.io-client";

import config from "../src/config";
import { morseCodeMap } from "../src/constants";

describe("Socket unit tests", function () {
  let socket: any;

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
    const inputTopic = "morse/input";
    const outputTopic = "morse/output";

    const tester = (combination: string, expected: string, done: any) => {
      socket.on(outputTopic, (data: string) => {
        socket.off(outputTopic);

        expect(data).toEqual(expected);

        done();
      });

      for (const morseCode of Array.from(combination)) {
        socket.emit(inputTopic, morseCode);
      }
      socket.emit(inputTopic, "");
    };

    Object.entries(morseCodeMap).forEach(([comb, char]) => {
      it(`Interpret ${comb}`, function (done) {
        tester(comb, char, done);
      });
    });
  });
});
