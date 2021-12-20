const { WebSocketServer } = require("ws");
module.exports = class{
    constructor(options) {
        this.port = options?.port || 8080;
        this.connections = [];
        this.wss = null;
    }

    listen(){
        this.wss = new WebSocketServer({ port: 8080 });
        this.wss.on('connection', this.connectionOpen);
    }

    connectionOpen(ws){
        this.connections.push({ws, id: Date.now().toString(9)});
        ws.on('message', data => {
            try{
                data = JSON.parse(data);
            }catch(e){
                // The data is not an object, so we don't use it.
                return !1;
            }
            this.listenEvents(data?.event, data?.data, data?.id);
        });
    }

    listenEvents(event, data, id){
        if(!event || !data || !this.connections.find(r => r.id === id)) return;
        switch(event){
            case 'register':
                this.register(data);
                break;
        }
        console.log(data);
    }

    register(data){
        if(!['mobile', 'pc'].includes(data.type)) return;
    }
}