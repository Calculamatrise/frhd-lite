// Changes on line 78 onwards

import "./Lite.js";

import Editor from "./scenes/Editor.js";
import Main from "./scenes/Main.js";

window.Game = class {
	gameContainer = null;
	lastTime = -1;
	progress = 0;
    tickCount = 0;
	ups = 30; // 60;
    currentScene = null;
    assets = null;
    canvas = null;
    stats = null;
    width = 0;
    height = 0;
    fullscreen = !1;
    onStateChange = null;
    constructor(t, e, i) {
        this.assets = e,
        this.settings = i,
        this.initCanvas(),
        this.setSize(),
        this.switchScene(t),
        this.setSize(),
		this.updateCallback = requestAnimationFrame(this.update.bind(this));
    }

    initCanvas() {
        this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
        this.gameContainer = document.getElementById(this.settings.defaultContainerID);
        if (this.gameContainer !== null) {
            this.gameContainer.appendChild(this.canvas);
        }
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
		this.ctx.strokeStyle = "#".padEnd(7, lite.storage.get("theme") == "midnight" ? "C" : lite.storage.get("theme") == "dark" ? "FB" : "0"),
		this.ctx.lineCap = "round",
        this.ctx.lineJoin = "round",
        this.currentScene && this.currentScene.command("resize")
    }

	update(time) {
		this.updateCallback = requestAnimationFrame(this.update.bind(this));
		let delta = time - this.lastTime;
		let max = 1e3 / this.ups;
		if (this.ups > 30) {
			if (delta > 1e3) {
				delta = max;
			}

			this.progress += delta / max;
			this.lastTime = time;

			while (this.progress >= 1) {
				this.currentScene.fixedUpdate();
				this.tickCount++;
				this.progress--;
			}

			this.currentScene.update(this.progress, delta);
		} else {
			if (delta >= max) {
				this.currentScene.fixedUpdate();
				this.lastTime = time;
				this.tickCount++;
			}
		}

		this.currentScene.draw(this.ctx),
        lite.draw(this.ctx)
    }

    switchScene(t) {
        this.currentScene !== null && this.currentScene.close(),
        this.currentScene = new { Editor, Main }[t](this)
    }

    command() {
        this.currentScene.command.apply(this.currentScene, arguments)
    }

    close() {
        cancelAnimationFrame(this.updateCallback),
        this.currentScene.close(),
        this.currentScene = null,
        this.assets = null,
        this.settings = null,
        this.canvas.remove(),
        this.canvas = null,
		this.ctx = null,
        this.tickCount = null,
        this.height = null,
        this.width = null
    }
}