import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import io from "socket.io-client";

import MorseCodeInterpreter from "./MorseCodeInterpreter";
import config from "../config";
import { sleep } from "../utils";

describe("should render Morse code interpreter", () => {
  describe("should render statically", () => {
    it("test UI elements", () => {
      const { getByText, rerender, queryByText } = render(
        <MorseCodeInterpreter isSocketConnected={false} />
      );

      const bannerElement = getByText(/I love Morse code/i);
      expect(bannerElement).toBeInTheDocument();

      let buttonElement = getByText(/Morse it/i);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveAttribute("disabled");

      let socketErrorElement = getByText(/can not connect to backend socket/i);
      expect(socketErrorElement).toBeInTheDocument();

      rerender(<MorseCodeInterpreter isSocketConnected={true} />);

      buttonElement = getByText(/Morse it/i);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).not.toHaveAttribute("disabled");

      queryByText(/can not connect to backend socket/i);
      expect(socketErrorElement).not.toBeInTheDocument();
    });
  });

  describe("should render dynamically", () => {
    const longPressThresholdInMs = 1500;
    const shortPressThresholdInMs = 1000;
    const idleThresholdInMs = 1500;

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

    it("test socket", async () => {
      expect(isSocketConnected).toBe(true);

      const { getByText, container } = render(
        <MorseCodeInterpreter
          isSocketConnected={isSocketConnected}
          socket={socketIO}
        />
      );

      // simulate a short press
      const shortPress = () =>
        act(() => {
          fireEvent.mouseDown(getByText(/Morse it/i));
          fireEvent.mouseUp(getByText(/Morse it/i));
        });
      // simulate a long press
      const longPress = () =>
        act(async () => {
          fireEvent.mouseDown(getByText(/Morse it/i));
          await sleep(longPressThresholdInMs * 1.1);
          fireEvent.mouseUp(getByText(/Morse it/i));
        });
      // simulate idle
      const idle = () =>
        act(async () => {
          await sleep(idleThresholdInMs * 1.1);
        });

      shortPress();
      expect(getByText(".")).toBeInTheDocument();

      await idle();
      expect(getByText("E")).toBeInTheDocument();

      await longPress();
      expect(getByText("-")).toBeInTheDocument();

      await idle();
      expect(getByText("ET")).toBeInTheDocument();
    }, 10000);
  });
});
