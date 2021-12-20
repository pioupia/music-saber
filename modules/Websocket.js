const { WebSocketServer } = require("ws"),
    { createServer }= require('https'),
    { readFileSync } = require("fs"),
    path = require("path"),
    basePath = path.dirname(__dirname),
    server = createServer({
        key: readFileSync(basePath + '/key.pem'),
        cert: readFileSync(basePath + '/cert.pem')
    });

module.exports = class{
    constructor(options) {
        this.port = options?.port || 8080;
        this.connections = [];
        this.wss = null;
    }

    listen(){
        this.wss = new WebSocketServer({ server });
        this.wss.on("ready", () => console.log(0))
        this.wss.on('connection', ws => this.connectionOpen(ws, this));
        server.listen(this.port);
    }

    connectionOpen(ws, _this){
        const id = Date.now().toString(9);
        _this.connections.push({ws, id});
        ws.on('message', data => {
            try{
                data = JSON.parse(data);
            }catch(e){
                // The data is not an object, so we don't use it.
                return !1;
            }
            _this.listenEvents(data?.event, data?.data, id);
        });
        ws.send(JSON.stringify({
            event: "id",
            data:{
                id
            }
        }));
    }

    listenEvents(event, data, id){
        if(!event || !data || !this.connections.find(r => r.id === id)) return;
        switch(event){
            case 'register':
                this.register(data, id);
                break;
            case 'posChange':
                this.posChange(data, id);
                break;
        }
    }

    register(data, id){
        if(!['mobile', 'pc'].includes(data.type)) return;
        const f = this.connections?.find(r => r?.id === id);
        if(f){
            f.type = data.type;
        }
        return !1;
    }

    posChange(data, id) {
        console.log(data);
        return this.connections.forEach(e => e.ws.send(JSON.stringify({event: "data", data})));
    }
}