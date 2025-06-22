import Track from "../tracks/track.js";
import LoadingCircle from "../utils/loadingcircle.js";
import MessageManager from "../utils/messagemanager.js";
import Score from "../utils/score.js";
import MouseHandler from "../utils/mousehandler.js";
import SoundManager from "../utils/soundmanager.js";
import CameraTool from "../tools/cameratool.js";
import ToolHandler from "../tools/toolhandler.js";
import VehicleTimer from "../utils/vehicletimer.js";
import PlayerManager from "../vehicles/player_manager.js";
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
	message = new MessageManager(this);
	constructor(t) {
		Object.defineProperty(this, 'game', { value: t, writable: true });
		this.assets = t.assets,
		this.settings = t.settings,
		this.mouse = new MouseHandler(this),
		this.camera = new Camera(this),
		this.score = new Score(this);
		this.screen = new Screen(this),
		this.sound = new SoundManager(this),
		this.createTrack(),
		this.loadingcircle = new LoadingCircle(this),
		this.playerManager = new PlayerManager(this),
		this.vehicleTimer = new VehicleTimer(this)
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
		this.track && this.track.close();
		let t = new Track(this);
		this.track = t;
		return t
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
		this.game.emit(this.game.constructor.Events.Clear, ctx);
		if (this.game.emit(this.game.constructor.Events.BeforeDraw, ctx)) return;
		/* !this.state.paused && */ /* !this.state.idle && */ (// ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
		this.toolHandler.drawGrid(ctx),
		this.track.draw(ctx)),
		this.score.draw(ctx),
		this.playerManager.draw(ctx),
		this.vehicleTimer.player && this.vehicleTimer.player._tempVehicleTicks > 0 && this.vehicleTimer.draw(ctx),
		this.toolHandler.draw(ctx),
		this.loading && this.loadingcircle.draw(ctx),
		this.message.draw(ctx)
	}
	fixedUpdate() {
		!this.game.interpolation && !this.camera.playerFocus?.isGhost() && this.camera.playerFocus?.isAlive() && this.camera.update(),
		!this.state.paused && !this.state.showDialog && (this.playerManager.updateGamepads(),
		this.playerManager.checkKeys()),
		!this.state.paused && this.state.playing && (this.message.update(),
		this.playerManager.fixedUpdate(),
		!this.camera.focusIndex && (this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++)),
		this.vehicleTimer.fixedUpdate()
	}
	update(delta) {
		this.restartTrack && this.restart();
		this.updateToolHandler();
		this.mouse.update();
		this.score.update();
		this.sound.update();
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
		this.score.redraw(),
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
	updateState(e = structuredClone(this.state)) {
		let t = this.state;
		t.zoomPercentage = this.camera.zoomPercentage,
		t.vehicle = this.vehicle;
		this.game.emit('stateChange', e, structuredClone(this.state));
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
	updateToolHandler() {
		this.toolHandler.update()
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
	stopAudio() {
		this.sound && this.sound.stop_all()
	}
	toggleFullscreen() {
		if (!this.settings.fullscreenAvailable) return !1;
		let e = !this.settings.fullscreen;
		this.settings.fullscreen = e,
		this.state.fullscreen = e;
		return !0
	}
	close() {
		this._onresize = null,
		this.score = null,
		this.mouse.close(),
		this.mouse = null,
		this.camera.close(),
		this.camera = null,
		this.screen.close(),
		this.screen = null,
		this.vehicleTimer.close(),
		this.vehicleTimer = null,
		this.playerManager.close(),
		this.playerManager = null,
		this.stopAudio(),
		this.sound.close(),
		this.sound = null,
		this.track.close(),
		this.toolHandler.close(),
		this.game = null,
		this.assets = null,
		this.settings = null,
		this.track = null,
		this.state = null
	}
}