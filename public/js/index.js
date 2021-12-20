class game{
    constructor() {
        this.isMobile = window.innerWidth < 1200;
        this.websocket = new webSocket('wss://localhost:8080');
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
        this.websocket.send("posChange", "test")
        const options = { frequency: 60, referenceFrame: 'device' };
        const sensor = new AbsoluteOrientationSensor(options);

        sensor.addEventListener('reading', (...data) => {
            // model is a Three.js object instantiated elsewhere.
            this.websocket.send("posChange", ...data);
        });
        sensor.addEventListener('error', error => {
            this.websocket.send("posChange", error);
            if (event.error.name == 'NotReadableError') {
                this.websocket.send("posChange", "Sensor is not available.");
                console.log("Sensor is not available.");
            }
        });
        Promise.all([navigator.permissions.query({ name: "accelerometer" }),
            navigator.permissions.query({ name: "magnetometer" }),
            navigator.permissions.query({ name: "gyroscope" })])
            .then(results => {
                if (results.every(result => result.state === "granted")) {
                    sensor.start();
                    this.websocket.send("posChange", "Sensor started");
                } else {
                    this.websocket.send("posChange", "No permissions to use AbsoluteOrientationSensor.");
                    console.log("No permissions to use AbsoluteOrientationSensor.");
                }
            }).catch((...e) => {
            this.websocket.send("posChange", "error");
            this.websocket.send("posChange", ...e);
        })
    }
}

const g = new game();
g.init();