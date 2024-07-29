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
	pauseControls = null;
	message = null;
	analytics = null;
	constructor(t) {
		Object.defineProperty(this, 'game', { value: t, writable: true });
		this.assets = t.assets,
		this.settings = t.settings,
		this.sound = new SoundManager(this),
		this.mouse = new MouseHandler(this),
		this.score = new Score(this),
		this.camera = new Camera(this),
		this.screen = new Screen(this),
		this.message = new MessageManager(this),
		this.createTrack(),
		this.loadingcircle = new LoadingCircle(this),
		this.playerManager = new PlayerManager(this),
		this.vehicleTimer = new VehicleTimer(this),
		Object.defineProperty(this, '_onresize', { value: this.redraw.bind(this), writable: true }),
		window.addEventListener('resize', this._onresize, { passive: true })
	}
	buttonDown(t) {
		let e = this.camera;
		switch (t) {
		case "change_camera":
			e.focusOnNextPlayer();
			break;
		case "pause":
			this.state.paused = !this.state.paused,
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
		/* !this.state.paused && */ /* !this.state.idle && */ (ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height),
		this.game.emit('clearRect', 0, 0, ctx.canvas.width, ctx.canvas.height, true),
		this.toolHandler.drawGrid(ctx),
		this.track.draw(ctx)),
		this.score.draw(ctx),
		this.playerManager.draw(ctx),
		this.vehicleTimer.player && this.vehicleTimer.player._tempVehicleTicks > 0 && this.vehicleTimer.draw(ctx),
		this.toolHandler.draw(ctx),
		this.loading && this.loadingcircle.draw(ctx),
		this.message.draw(ctx),
		this.pauseControls.draw(ctx)
	}
	fixedUpdate() {
		this.screen.update(),
		this.updateControls(),
		this.camera.update(),
		this.sound.update(),
		this.restartTrack && this.restart(),
		!this.state.paused && this.state.playing && (this.message.update(),
		this.playerManager.fixedUpdate(),
		!this.camera.focusIndex && (this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++)),
		this.score.update(),
		this.vehicleTimer.fixedUpdate(),
		this.isStateDirty() && this.updateState(),
		this.camera.updateZoom()
	}
	getAvailableTrackCode() {
		let t = this.settings
		  , e = !1;
		return t.importCode && e != t.importCode ? (e = t.importCode,
		t.importCode = null) : this.importCode && (e = this.importCode,
		this.importCode = null),
		e
	}
	hideControlPlanel() {}
	interactWithControls() {
		this.pauseControls.click()
	}
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
	redrawControls() {
		this.pauseControls.redraw()
	}
	registerTools() {
		let t = new ToolHandler(this);
		this.toolHandler = t,
		t.registerTool(CameraTool);
		return t
	}
	resize() {
		this.redrawControls()
	}
	showControlPlanel() {}
	updateState() {
		let t = this.state
		  , e = structuredClone(this.state);
		t.zoomPercentage = this.camera.zoomPercentage,
		t.vehicle = this.vehicle,
		this.game.emit('stateChange', this.state),
		this.game.emit('stateUpdate', e, structuredClone(this.state)),
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
	updateControls() {
		this.pauseControls.update()
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
		if (this.settings.embedded) {
			let t = this.settings
			  , e = t.basePlatformUrl + "/t/" + t.track.url;
			window.open(e)
		} else if (this.settings.fullscreenAvailable) {
			let e = !this.settings.fullscreen;
			this.settings.fullscreen = e,
			this.state.fullscreen = e;
			return !0
		}
	}
	close() {
		window.removeEventListener('resize', this._onresize),
		this._onresize = null,
		this.pauseControls = null,
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
		this.sound.close(),
		this.sound = null,
		this.track.close(),
		this.toolHandler.close(),
		this.game = null,
		this.assets = null,
		this.settings = null,
		this.track = null,
		this.state = null,
		this.stopAudio()
	}
}