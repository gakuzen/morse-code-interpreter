# Morse code interpreter

Interprets Morse code in real-time

- supports English letters only at the moment ([ITU morse code table](http://www.mdarc.org/_/rsrc/1519670493939/resources/operating-aids/morse-code/Morse%20Code06.jpg?height=279&width=400))

## How to run

### Backend

Run `npm run watch` at `web-api/`.

### Frontend

Run `npm start` at `web-gui/`.

## How to use

After starting both backend and frontend locally, open http://localhost:3001 to use it in the browser.

## How to test

### Backend

Run `npm run watch-test` at `web-api/`.

### Frontend

Run `npm run test` at `web-gui/`.

## Libraries used for core functionalities

### Backend

- `express` (HTTP server)
- `socket.io` (real-time WebSocket server)
- `winston` (production-ready logger)
- `jest` (unit testing)

### Frontend

- `react`
- `socket.io-client` (real-time WebSocket client)
- `testing-library` (unit testing)
