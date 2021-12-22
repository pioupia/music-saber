const express = require("express"),
    app = express(),
    websocket = require("./modules/Websocket"),
    path = require("path");

const ws = new websocket();
ws.listen();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile("./pages/index.html", {
        root: path.join(__dirname, './')
    })
})


app.listen(3000);