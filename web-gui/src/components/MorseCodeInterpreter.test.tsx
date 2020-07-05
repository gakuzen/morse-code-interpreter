import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import io from "socket.io-client";

import MorseCodeInterpreter from "./MorseCodeInterpreter";
import config from "../config";
import { sleep } from "../utils";
import {
  longPressThresholdInMs,
  shortPressThresholdInMs,
  idleThresholdInMs,
} from "../constants";

describe("should render Morse code interpreter", (): void => {
  describe("should render statically", (): void => {
    it("test UI elements", (): void => {
      const { getByText, rerender, queryByText } = render(
        <MorseCodeInterpreter isSocketConnected={false} socket={null} />
      );

      const bannerElement: HTMLElement = getByText(/I love Morse code/i);
      expect(bannerElement).toBeInTheDocument();

      const buttonElement: HTMLElement = getByText(/Morse it/i);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveAttribute("disabled");

      const socketErrorElement: HTMLElement = getByText(
        /can not connect to backend socket/i
      );
      expect(socketErrorElement).toBeInTheDocument();

      rerender(<MorseCodeInterpreter isSocketConnected={true} socket={null} />);

      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).not.toHaveAttribute("disabled");

      queryByText(/can not connect to backend socket/i);
      expect(socketErrorElement).not.toBeInTheDocument();
    });
  });

  describe("should render dynamically", (): void => {
    let socketIO: SocketIOClient.Socket;
    let isSocketConnected: boolean;

    beforeAll(function (done) {
      socketIO = io(config.socketUrl);
      socketIO.on("connect", function () {
        isSocketConnected = true;
        done();
      });
      socketIO.on("disconnect", function () {
        isSocketConnected = false;
      });
    });

    afterAll(function (done) {
      if (socketIO) {
        socketIO.disconnect();
      }
      done();
    });

    const timeoutInMs = 10000;
    it(
      "test socket",
      async (): Promise<void> => {
        expect(isSocketConnected).toBe(true);

        const { getByText, container } = render(
          <MorseCodeInterpreter
            isSocketConnected={isSocketConnected}
            socket={socketIO}
          />
        );

        const morseButton = getByText(/Morse it/i);

        // simulate a short press
        const shortPress = (): void =>
          act((): void => {
            fireEvent.mouseDown(morseButton);
            fireEvent.mouseUp(morseButton);
          });
        // simulate a long press
        const longPress = (): Promise<undefined> =>
          act(
            async (): Promise<void> => {
              fireEvent.mouseDown(morseButton);
              await sleep(longPressThresholdInMs * 1.1);
              fireEvent.mouseUp(morseButton);
            }
          );
        // simulate idle
        const idle = (): Promise<undefined> =>
          act(
            async (): Promise<void> => {
              await sleep(idleThresholdInMs * 1.1);
            }
          );

        shortPress();
        expect(getByText(".")).toBeInTheDocument();

        await idle();
        expect(getByText("E")).toBeInTheDocument();

        await longPress();
        expect(getByText("-")).toBeInTheDocument();

        await idle();
        expect(getByText("ET")).toBeInTheDocument();
      },
      timeoutInMs
    );
  });
});
