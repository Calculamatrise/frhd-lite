import "../libs/createjs.js";
import "./Lite.js";

import Editor from "./scenes/Editor.js";
import Main from "./scenes/Main.js";

window.Game = class {
    constructor(t, e, i) {
        this.assets = e,
        this.settings = i,
        this.initCanvas(),
        this.setSize(),
        this.switchScene(t),
        this.setSize(),
        this.startTicker()
    }
    gameContainer = null;
    tickCount = 0;
    currentScene = null;
    assets = null;
    canvas = null;
    stats = null;
    width = 0;
    height = 0;
    fullscreen = !1;
    onStateChange = null;
    initCanvas() {
        this.gameContainer = document.getElementById(this.settings.defaultContainerID),
        this.gameContainer.appendChild(this.canvas = document.createElement("canvas"));
    }
    setSize() {
        let t = window.innerHeight,
            e = window.innerWidth;
        if (!this.settings.fullscreen && !this.settings.isStandalone) {
            t = this.gameContainer.clientHeight,
            e = this.gameContainer.clientWidth
        }
        if (this.currentScene) {
            t -= this.currentScene.getCanvasOffset().height
        }
        let n = 1;
        void 0 !== window.devicePixelRatio && (n = window.devicePixelRatio),
        this.settings.lowQualityMode && (n = 1);
        let r = e * n,
            o = t * n;
        (r !== this.width || o !== this.height) && (this.width = r,
        this.height = o,
        this.canvas.width = r,
        this.canvas.height = o),
        this.pixelRatio = n,
        this.canvas.style.width = e + "px",
        this.canvas.style.height = t + "px",
        this.currentScene && this.currentScene.command("resize")
    }
    startTicker() {
        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCED,
        createjs.Ticker.setFPS(this.settings.drawFPS),
        createjs.Ticker.on("tick", this.update.bind(this))
    }
    update() {
        this.currentScene.update(),
        this.canvas.style.background = lite.getVar("dark") ? "#1d1d1d" : "#fff",
        lite.getVar("di") && lite.drawInputDisplay(this.canvas),
        this.tickCount++
    }
    switchScene(t) {
        this.currentScene !== null && this.currentScene.close(),
        this.currentScene = new { Editor, Main }[t](this)
    }
    command() {
        this.currentScene.command.apply(this.currentScene, arguments)
    }
    close() {
        createjs.Ticker.reset(),
        createjs.Ticker.removeAllEventListeners(),
        this.currentScene.close(),
        this.currentScene = null,
        this.assets = null,
        this.settings = null,
        this.canvas.parentNode.removeChild(this.canvas),
        this.canvas = null,
        this.tickCount = null,
        this.height = null,
        this.width = null
    }
}