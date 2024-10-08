import "./ThirdPartyManager.js";
import "./Lite.js";
import EventEmitter from "./EventEmitter.js";

import Editor from "./scenes/Editor.js";
import Main from "./scenes/Main.js";

window.Game = class extends EventEmitter {
	gameContainer = null;
	_frames = 0;
	frames = 0;
	lastTime = -1;
	timer = performance.now();
	_updates = 0;
	updates = 0;
	ups = 30; // 60;
	tickCount = 0;
	currentScene = null;
	assets = null;
	canvas = null;
	stats = null;
	width = 0;
	height = 0;
	fullscreen = !1;
	onStateChange = null;
	constructor(t, e, i) {
		super();
		this.assets = e,
		this.settings = i,
		this.initCanvas(),
		this.setSize(),
		this.switchScene(t),
		this.setSize(),
		(window.createjs ||= {}).Ticker ||= this,
		Object.defineProperty(this, 'updateCallback', {
			value: requestAnimationFrame(this.update.bind(this)),
			writable: true
		}),
		this.emit('ready', this)
	}
	initCanvas() {
		this.canvas = document.createElement("canvas"),
		this.canvas.addEventListener("dblclick", () => this.currentScene instanceof Main && this.currentScene.toggleFullscreen(), { passive: true }),
		this.ctx = this.canvas.getContext("2d"),
		this.gameContainer = document.getElementById(this.settings.defaultContainerID),
		this.gameContainer !== null && this.gameContainer.appendChild(this.canvas)
	}
	setSize() {
		let t = window.innerHeight
		  , e = window.innerWidth;
		if (!this.settings.fullscreen && !this.settings.isStandalone) {
			t = this.gameContainer.clientHeight,
			e = this.gameContainer.clientWidth
		}
		this.currentScene && (t -= this.currentScene.getCanvasOffset().height)
		let n = 1;
		window.devicePixelRatio && (n = window.devicePixelRatio),
		this.settings.lowQualityMode && (n = 1);
		let r = e * n
		  , o = t * n;
		(r !== this.width || o !== this.height) && (this.width = r,
		this.height = o,
		this.canvas.width = r,
		this.canvas.height = o),
		this.pixelRatio = n,
		this.canvas.style.width = e + "px",
		this.canvas.style.height = t + "px",
		this.ctx.imageSmoothingEnabled = !1,
		this.ctx.lineCap = "round",
		this.ctx.lineJoin = "round",
		this.ctx.strokeStyle = this.settings.physicsLineColor,
		this.currentScene && this.currentScene.command("resize")
	}

	progress = 0
	update(time) {
		this.updateCallback = requestAnimationFrame(this.update.bind(this));
		let delta = time - this.lastTime
		  , max = 1e3 / this.ups;
		// if (delta >= max) {
		// 	console.log(this.updates, this.lastTime, time, time + max)
		// 	this.lastTime = time + max;
		// 	this.currentScene.fixedUpdate();
		// 	this._updates++;
		// }

		if (delta > 1e3) {
			delta = max;
		}

		this.progress += delta / max,
		this.lastTime = time;
		while (this.progress >= 1) {
			this.currentScene.fixedUpdate(),
			this.emit('tick', ++this._updates),
			this.progress--
		}

		this.currentScene.draw(this.ctx),
		this.emit('draw', this.ctx),
		this._frames++;
		if (time - this.timer > 1e3) {
			this.timer = time,
			this.updates = this._updates,
			this._updates = 0,
			this.frames = this._frames,
			this._frames = 0
		}
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
		this.updateCallback = null,
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