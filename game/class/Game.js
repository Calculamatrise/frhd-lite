import EventEmitter from "./EventEmitter.js";
import Editor from "./scenes/Editor.js";
import Main from "./scenes/Main.js";
import Events from "./utils/events.js";

const SCENES =  { Editor, Main };
class Game extends EventEmitter {
	static Events = Events;
	#frames = 0;
	#lastFrameTime = performance.now();
	#timer = performance.now();
	#updates = 0;
	stats = { fps: 0, ups: 0 };
	config = { maxFrameRate: null, tickRate: 30 };
	// config = { maxFrameRate: null, tickRate: 60 };
	frameInterval = 1e3 / this.config.maxFrameRate;
	interpolation = true;
	updateInterval = 1e3 / this.config.tickRate;
	assets = null;
	canvas = null;
	currentScene = null;
	gameContainer = null;
	height = 0;
	onStateChange = null;
	pixelRatio = window.devicePixelRatio;
	width = 0;
	constructor(t, e, i) {
		super();
		Object.defineProperties(this, {
			lastTime: { value: performance.now(), writable: true },
			linearInterpolation: { value: true, writable: true },
			progress: { value: 0, writable: true }
		});
		this.assets = e;
		i.UIDarkerGrayColor ||= '#777777';
		i.UIGrayColor ||= '#808080';
		i.UITextColor ||= '#000000';
		this.settings = i;
		this.initCanvas();
		this.setSize();
		this.switchScene(t);
		(globalThis.createjs ||= {}).Ticker ||= this;
		Object.defineProperty(this, 'updateCallback', {
			value: requestAnimationFrame(this.update.bind(this)),
			writable: true
		});
		this.emit(Events.Ready)
	}
	command() {
		this.currentScene.command.apply(this.currentScene, arguments)
	}
	freeze() {
		cancelAnimationFrame(this.updateCallback)
	}
	initCanvas() {
		this.canvas = document.createElement("canvas"),
		this.canvas.addEventListener("dblclick", () => this.currentScene instanceof Main && this.currentScene.toggleFullscreen(), { passive: true }),
		this.ctx = this.canvas.getContext("2d"),
		this.gameContainer = document.getElementById(this.settings.defaultContainerID),
		this.gameContainer !== null && this.gameContainer.appendChild(this.canvas)
	}
	resetFrameProgress() {
		this.lastTime = performance.now();
		this.progress = 0;
		this.config.maxFrameRate && (this.#lastFrameTime = this.lastTime)
	}
	resume() {
		this.updateCallback = requestAnimationFrame(this.update.bind(this))
	}
	setMaxFrameRate(fps) {
		this.config.maxFrameRate = fps;
		this.frameInterval = 1e3 / fps
	}
	setSize() {
		let t = window.innerHeight
		  , e = window.innerWidth;
		if (!this.settings.fullscreen && !this.settings.isStandalone) {
			t = this.gameContainer.clientHeight,
			e = this.gameContainer.clientWidth;
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
		this.currentScene && (this.currentScene.command("resize"),
		this.currentScene.screen.update(),
		(this.currentScene.state.paused || !this.currentScene.state.playing) && this.currentScene.draw(this.ctx));
		this.emit(Events.Resize, {
			devicePixelRatio: n,
			height: o,
			width: r
		})
	}
	switchScene(t) {
		this.currentScene !== null && this.currentScene.close(),
		this.currentScene = new SCENES[t](this),
		this.emit(Events.SceneChange, this.currentScene)
	}
	update(time) {
		// DEBUG
		if (this._lastRafTime !== null) {
			let rafDelta = time - this._lastRafTime;
			(this._rafDeltaHist ||= []).push(rafDelta);
			if (this._rafDeltaHist.length > 300) this._rafDeltaHist.shift();
			if (rafDelta > 20) console.warn(`Slow rAF frame: ${Math.round(rafDelta)}ms`);
		}
		this._lastRafTime = time;
		// DEBUG END

		this.updateCallback = requestAnimationFrame(this.update.bind(this));
		if (this._wasPaused !== this.currentScene.state.paused) {
			this._wasPaused = this.currentScene.state.paused;
			!this.currentScene.state.paused && this.resetFrameProgress();
			this.lastTime = time;
		}

		let delta = time - this.lastTime;
		if (delta >= 1e3) {
			delta = this.updateInterval;
		}

		this.progress += delta / this.updateInterval;
		// if (this.progress >= 1 && this.currentScene.state.paused) {
		// 	this.freeze();
		// 	return;
		// }

		this.lastTime = time;
		while (this.progress >= 1) {
			this.progress--;
			if (this.emit(Events.Tick, this.currentScene.ticks)) continue;
			this.currentScene.fixedUpdate();
			this.#updates++
		}

		if (!this.config.maxFrameRate || time - this.#lastFrameTime >= this.frameInterval) {
			this.config.maxFrameRate && (this.#lastFrameTime = time);
			this.currentScene.update(this.progress);
			this.currentScene.lateUpdate(this.progress);
			this.currentScene.draw(this.ctx);
			this.emit(Events.Draw, this.ctx);
			this.#frames++;
		}

		if (time - this.#timer >= 1e3) {
			this.#timer = time,
			this.stats.ups = this.#updates,
			this.stats.fps = this.#frames,
			this.#updates = 0,
			this.#frames = 0,
			this.emit(Events.Stats, {
				fps: this.stats.fps,
				ups: this.stats.ups
			})
		}
	}
	close() {
		this.freeze(),
		this.updateCallback = null,
		this.currentScene.close(),
		this.currentScene = null,
		this.assets = null,
		this.settings = null,
		this.canvas.remove(),
		this.canvas = null,
		this.ctx = null,
		this.height = null,
		this.width = null
	}
}

Object.defineProperty(self, 'Game', {
	value: Game,
	writable: true
});