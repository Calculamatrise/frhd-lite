import Track from "../tracks/track.js";
import LoadingCircle from "../hud/loadingcircle.js";
import MessageManager from "../hud/messagemanager.js";
import Score from "../hud/score.js";
import MouseHandler from "../handlers/mouse.js";
import SoundManager from "../managers/soundmanager.js";
import CameraTool from "../tools/cameratool.js";
import ToolHandler from "../tools/toolhandler.js";
import VehicleTimer from "../hud/vehicletimer.js";
import PlayerManager from "../managers/player_manager.js";
import Camera from "../view/camera.js";
import Screen from "../view/screen.js";

export default class {
	assets = null;
	settings = null;
	camera = null;
	screen = null;
	mouse = null;
	track = null;
	ticks = 0;
	state = null;
	oldState = null;
	vehicle = "Mtb";
	importCode = !1;
	vehicleTimer = null;
	constructor(t) {
		Object.defineProperty(this, 'game', { value: t, writable: true });
		this.assets = t.assets,
		this.settings = t.settings,
		this.mouse = new MouseHandler(this),
		this.camera = new Camera(this),
		this.message = new MessageManager(this),
		this.score = new Score(this),
		this.screen = new Screen(this),
		this.sound = new SoundManager(this),
		this.createTrack(),
		this.loadingcircle = new LoadingCircle(this),
		this.playerManager = new PlayerManager(this)
	}

	buttonDown(t) {
		let e = this.camera;
		switch (t) {
		case "change_camera":
			e.focusOnNextPlayer();
			break;
		case "pause":
			this.state.paused = !this.state.paused;
			// (this.state.paused = !this.state.paused) || this.game.resume(),
			'mediaSession' in navigator && (navigator.mediaSession.playbackState = this.state.paused ? 'paused' : 'playing');
			this.state.paused && Object.defineProperty(this, '_idleStateTimeout', {
				value: setTimeout(() => this.state.idle = this.state.paused, 300),
				writable: true
			}) || (this._idleStateTimeout && clearTimeout(this._idleStateTimeout),
			this.state.idle = false);
			this.updateState();
			break;
		case "settings":
			this.openDialog("settings");
			break;
		case "exit_fullscreen":
			this.exitFullscreen();
			break;
		case "change_vehicle":
			this.toggleVehicle(),
			this.updateState();
			break;
		case "zoom_increase":
			e.increaseZoom(),
			this.updateState();
			break;
		case "zoom_decrease":
			e.decreaseZoom(),
			this.updateState();
			break;
		case "fullscreen":
			this.toggleFullscreen(),
			this.updateState()
		}
	}

	createMainPlayer() {
		let t = this.playerManager
		  , e = t.createPlayer(this, this.settings.user)
		  , i = e.getGamepad();
		i.onButtonDown = this.buttonDown.bind(this),
		i.listen(),
		this.playerManager.firstPlayer = e,
		this.playerManager.addPlayer(e);
		return i
	}

	createTrack() {
		this.track?.[Symbol.dispose]();
		const t = new Track(this);
		this.track = t;
		return t
	}

	createVehicleTimer(t) {
		const e = new VehicleTimer(this);
		t && e.setPlayer(t);
		this.vehicleTimer = e
	}

	command(t, ...e) {
		switch (t) {
		case "resize":
			this.resize();
			break;
		case "dialog":
			var i = e[0];
			i === !1 ? this.listen() : this.unlisten(),
			this.openDialog(i);
			break;
		case "focused":
			let s = e[0];
			s === !0 ? (this.state.inFocus = !0,
			this.state.showDialog === !1 && this.listen()) : (this.state.inFocus = !1,
			this.unlisten(),
			this.state.playing = !1);
			break;
		case "add track":
			this.importCode = e[0].code
		}
	}

	draw(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if (this.game.emit(this.game.constructor.Events.BeforeDraw, ctx)) return;
		/* !this.state.paused && */ /* !this.state.idle && */ (// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
		this.toolHandler.drawGrid(ctx),
		this.track.draw(ctx)),
		this.playerManager.draw(ctx),
		this.toolHandler.draw(ctx),
		this.loading && this.loadingcircle.draw(ctx)
	}

	fixedUpdate() {
		!this.game.interpolation && !this.camera.playerFocus?.isGhost() && this.camera.playerFocus?.isAlive() && this.camera.update(),
		!this.state.paused && !this.state.showDialog && (this.playerManager.updateGamepads(),
		this.playerManager.checkKeys()),
		!this.state.paused && this.state.playing && (this.message.update(),
		this.playerManager.fixedUpdate(),
		!this.camera.focusIndex && !this.playerManager.firstPlayer.complete && this.game.emit('tick', this.ticks++),
		this.vehicleTimer?.fixedUpdate());
		this.score.update();
		this.sound.update()
	}

	update(delta) {
		this.restartTrack && this.restart();
		this.toolHandler.update();
		this.mouse.update(); // Remove
		this.playerManager.update(delta)
	}

	lateUpdate(delta) {
		!this.state.paused && this.state.playing && this.playerManager.lateUpdate(),
		(this.game.interpolation || this.camera.playerFocus?.isGhost() || !this.camera.playerFocus?.isAlive()) && this.camera.update(delta),
		this.camera.updateZoom(delta),
		this.isStateDirty() && this.updateState(),
		this.importCode && this.createTrack()
	}

	exitFullscreen() {
		if (!this.settings.fullscreenAvailable) return !1;
		this.settings.fullscreen = !1;
		this.state.fullscreen = !1;
		return !0
	}

	getAvailableTrackCode() {
		let t = this.settings
		  , e = !1;
		return t.importCode && e != t.importCode ? (e = t.importCode,
		t.importCode = null) : this.importCode && (e = this.importCode,
		this.importCode = null),
		e
	}

	initAnalytics() {
		Object.defineProperty(this, 'analytics', {
			value: { deaths: 0 },
			writable: true
		})
	}

	interactWithControls() {}
	isStateDirty() {
		let i = !1;
		for (let s in this.state)
			this.state[s] !== this.oldState[s] && (i = !0,
			this.oldState[s] = this.state[s]);
		return i
	}

	redraw() {
		this.track.undraw(),
		GameInventoryManager.redraw(),
		this.toolHandler.resize()
	}

	redrawControls() {}
	registerTools() {
		let t = new ToolHandler(this);
		this.toolHandler = t,
		t.registerTool(CameraTool);
		return t
	}

	resize() {
		// this.toolHandler.resize()
	}

	updateState() {
		let t = this.state;
		t.zoomPercentage = this.camera.zoomPercentage,
		t.vehicle = this.vehicle;
		this.game.emit('stateChange', this.oldState, this.state);
		this.message.onStateChange(this.oldState, this.state);
		this.score.onStateChange(this.oldState, this.state);
		null !== this.game.onStateChange && this.game.onStateChange(this.state)
	}

	toggleVehicle() {
		let t = this.track.allowedVehicles
		  , e = t.length
		  , i = (this.state.vehicle || this.vehicle).toUpperCase()
		  , s = t.indexOf(i);
		i = t[++s % e];
		this.selectVehicle(i)
	}

	selectVehicle(t) {
		let e = this.track.allowedVehicles
		  , i = e.indexOf(t);
		-1 !== i && (this.settings.track.vehicle = t,
		this.vehicle = t,
		this.playerManager.firstPlayer.setBaseVehicle(t),
		this.restartTrack = !0)
	}

	listen() {
		let t = this.playerManager.firstPlayer
		  , e = t.getGamepad();
		e.listen()
	}

	unlisten() {
		let t = this.playerManager.firstPlayer
		  , e = t.getGamepad();
		e.unlisten()
	}

	openDialog(t) {
		this.state.playing = !1,
		this.state.showDialog = t
	}

	setStateDefaults() {
		let t = {};
		return t.playing = !this.settings.waitForKeyPress,
		t.showDialog = !1,
		t.dialogOptions = !1,
		t.preloading = !0,
		t.fullscreen = this.settings.fullscreen,
		t.inFocus = !0,
		t
	}

	toggleFullscreen() {
		if (!this.settings.fullscreenAvailable) return !1;
		let e = !this.settings.fullscreen;
		this.settings.fullscreen = e,
		this.state.fullscreen = e;
		return !0
	}

	[Symbol.dispose]() {
		this._onresize = null,
		this.score = null,
		this.mouse[Symbol.dispose](),
		this.mouse = null,
		this.camera[Symbol.dispose](),
		this.camera = null,
		this.screen[Symbol.dispose](),
		this.screen = null,
		this.vehicleTimer?.[Symbol.dispose](),
		this.vehicleTimer = null,
		this.playerManager[Symbol.dispose](),
		this.playerManager = null,
		this.sound.stopAll(),
		this.sound[Symbol.dispose](),
		this.sound = null,
		this.track[Symbol.dispose](),
		this.toolHandler[Symbol.dispose](),
		this.game = null,
		this.assets = null,
		this.settings = null,
		this.track = null,
		this.state = null
	}
}