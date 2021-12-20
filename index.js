const express = require("express"),
    app = express(),
    websocket = require("./Websocket");

const ws = new websocket();
ws.listen();

let sessions = [];

app.listen(3000);