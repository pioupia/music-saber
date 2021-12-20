const express = require("express"),
    app = express(),
    websocket = require("./modules/Websocket"),
    { createServer }= require('https'),
    { readFileSync } = require("fs"),
    path = require("path"),
    basePath = path.dirname(__filename),
    server = createServer({
        key: readFileSync(basePath + '/key.pem'),
        cert: readFileSync(basePath + '/cert.pem')
    }, app);

const ws = new websocket();
ws.listen();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile("./pages/index.html", {
        root: path.join(__dirname, './')
    })
})


server.listen(3000);