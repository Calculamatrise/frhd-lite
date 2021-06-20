import "../libs/createjs.js";
import "../libs/performance.js";
import "./Lite.js";

import Editor from "./scenes/Editor.js";
import Main from "./scenes/Main.js";

let r = {
    Editor,
    Main
};

export default window.Game = class {
    constructor(t, e, i) {
        this.assets = e,
        this.settings = i,
        this.initCanvas(),
        this.initStage(),
        this.setSize(),
        this.switchScene(t),
        this.setSize(),
        this.startTicker()
    }
    gameContainer = null;
    tickCount = 0;
    currentScene = null;
    assets = null;
    stage = null;
    canvas = null;
    stats = null;
    width = 0;
    height = 0;
    fullscreen = !1;
    onStateChange = null;
    initCanvas() {
        var t = document.createElement("canvas")
            , e = document.getElementById(this.settings.defaultContainerID);
        e.appendChild(t),
        this.gameContainer = e,
        this.canvas = t
    }
    initStage() {
        var t = new createjs.Stage(this.canvas);
        t.autoClear = !1,
        createjs.Touch.enable(t),
        t.enableMouseOver(30),
        t.mouseMoveOutside = !0,
        t.preventSelection = !1,
        this.stage = t
    }
    setSize() {
        var t = window.innerHeight
            , e = window.innerWidth;
        if (!this.settings.fullscreen && !this.settings.isStandalone) {
            var i = this.gameContainer;
            t = i.clientHeight,
            e = i.clientWidth
        }
        if (this.currentScene) {
            var s = this.currentScene.getCanvasOffset();
            t -= s.height
        }
        var n = 1;
        void 0 !== window.devicePixelRatio && (n = window.devicePixelRatio),
        this.settings.lowQualityMode && (n = 1);
        var r = e * n
            , o = t * n;
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
        this.canvas.style.background = window.lite.getVar("dark") ? "#1d1d1d" : "#fff",
        window.lite.getVar("di") && window.lite.drawInputDisplay(this.canvas),
        this.tickCount++
    }
    switchScene(t) {
        null !== this.currentScene && this.currentScene.close(),
        this.currentScene = new r[t](this)
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
        this.stage.autoClear = !0,
        this.stage.removeAllChildren(),
        this.stage.update(),
        this.stage.enableDOMEvents(!1),
        this.stage.removeAllEventListeners(),
        this.stage = null,
        this.canvas.parentNode.removeChild(this.canvas),
        this.canvas = null,
        this.tickCount = null,
        this.height = null,
        this.width = null
    }
}

setTimeout(() => {
    if (!GameManager.game) {
        GameManager.loadGame()
    }
}, 500);