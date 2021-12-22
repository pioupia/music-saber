class game{
    constructor() {
        this.isMobile = window.innerWidth < 1200;
        this.websocket = new webSocket('ws://'+document.domain+':8080');
    }
    init(){
        // Registering events
        this.websocket.on("ready", () => {
            this.websocket.send("register", this.isMobile ? 'mobile' : 'pc');
            if(this.isMobile) this.mobilePerms();
        });
        this.websocket.on("id", data => {
            this.id = data.id;
        });
        this.websocket.on("sessionOpen", data => {
            this.session = data.sessionId;
        });
        this.websocket.on("sessionClose", () => {
            this.session = null;
        });
        this.websocket.on("data", data => {
            console.log(data);
        })

        this.websocket.open();
    }

    mobilePerms(){
        this.websocket.send("posChange", "test");
        const _this = this;
        window.addEventListener("deviceorientation", ev => {
            _this.websocket.send("posChange", ev);
            console.log(ev);
        });
    }
}

const g = new game();
g.init();
