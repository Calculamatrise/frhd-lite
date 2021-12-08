// Changes on line 78 onwards

import "../libs/createjs.js";
import "./Lite.js";
// import("https://calculamatrise.github.io/frhd/lite/class/Lite.js");

import Editor from "./scenes/Editor.js";
import Main from "./scenes/Main.js";

window.Game = class {
    constructor(t, e, i) {
        this.assets = e,
        this.settings = i || window.hasOwnProperty("GameSettings") && window.GameSettings,
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
    static init() {
        const loadGame = GameManager.loadGame;
        GameManager.loadGame = function() {
            if (GameManager.hasOwnProperty("game")) {
                GameManager.closeGame();
            }
            
            loadGame.bind(this)();
        }
        
        GameManager.loadGame();
    }
    initCanvas() {
        this.canvas = document.createElement("canvas");
        this.gameContainer = document.getElementById(this.settings.defaultContainerID),
        this.gameContainer.appendChild(this.canvas);
    }
    initStage() {
        let t = new createjs.Stage(this.canvas);
        t.autoClear = !1,
        createjs.Touch.enable(t),
        t.enableMouseOver(30),
        t.mouseMoveOutside = !0,
        t.preventSelection = !1,
        this.stage = t
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
        // Implemented dark mode and input display
        this.canvas.style.setProperty("background-color", window.lite.storage.get("theme") === "midnight" ? "#1d2328" : window.lite.storage.get("theme") === "dark" ? "#1b1b1b" : "#fff"),
        window.lite.focusOverlay && window.lite.focusOverlay.style.setProperty("background-color", window.lite.storage.get("theme") === "midnight" ? "#333333bb" : window.lite.storage.get("theme") === "dark" ? "#000000bb" : "#ffffffbb"),
        this.currentScene.update(),
        lite.storage.get("di") && lite.drawInputDisplay(this.canvas),
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

Game.init();