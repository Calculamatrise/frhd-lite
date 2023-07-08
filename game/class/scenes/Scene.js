import Track from "../tracks/track.js";
import LoadingCircle from "../utils/loadingcircle.js";
import MessageManager from "../utils/messagemanager.js";
import Score from "../utils/score.js";
import MouseHandler from "../utils/mousehandler.js";
import SoundManager from "../utils/soundmanager.js";
import VehicleTimer from "../utils/vehicletimer.js";
import PlayerManager from "../vehicles/player_manager.js";
import Camera from "../view/camera.js";
import Screen from "../view/screen.js";

export default class {
	game = null;
    assets = null;
    settings = null;
    camera = null;
    screen = null;
    mouse = null;
    track = null;
    player = null;
    players = null;
    ticks = 0;
    state = null;
    oldState = null;
    stateDirty = !0;
    onStateChange = null;
    vehicle = "Mtb";
    showDialog = !1;
    importCode = !1;
    pauseControls = null;
    controls = null;
    message = null;
    analytics = null;
    constructor(t) {
        this.game = t,
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
        this.vehicleTimer = new VehicleTimer(this)
    }
    createMainPlayer() {
        var t = this.playerManager
            , e = t.createPlayer(this, this.settings.user)
            , i = e.getGamepad();
        i.setKeyMap(this.settings.editorHotkeys),
        i.onButtonDown = this.buttonDown.bind(this),
        i.listen(),
        this.playerManager.firstPlayer = e,
        this.playerManager.addPlayer(e)
    }
    createTrack() {
        this.track && this.track.close();
        let t = new Track(this)
          , e = this.getAvailableTrackCode();
        0 != e ? (t.read(e),
        this.track = t,
        this.state.preloading = !1,
        this.state.loading = !1) : t.addDefaultLine(),
        this.importCode = !1,
        this.restartTrack = !0,
        this.clear = !1,
        this.track = t
    }
    getAvailableTrackCode() {
        let t = this.settings
          , e = !1;
        return t.importCode && "false" !== t.importCode ? (e = t.importCode,
        t.importCode = null) : this.importCode && (e = this.importCode,
        this.importCode = null),
        e
    }
    updateControls() {
        if (this.controls) {
            var t = this.state.paused;
            this.controls.isVisible() === t && (t || (this.state.playing = !1,
            this.camera.focusOnMainPlayer(),
            this.toolHandler.setTool("camera")),
            this.controls.setVisibility(!t),
            this.updateState()),
            this.controls.update()
        }
        this.pauseControls.update()
    }
	interactWithControls() {
		this.controls && this.controls.click(),
		this.pauseControls.click()
	}
    isStateDirty() {
        let i = !1;
        for (let s in this.state)
            this.state[s] !== this.oldState[s] && (i = !0,
            this.oldState[s] = this.state[s]);
        return i
    }
    draw() {
		let t = this.game.canvas.getContext("2d");
		t.clearRect(0, 0, t.canvas.width, t.canvas.height);
        this.toolHandler.drawGrid(),
        this.track.draw(),
		this.score.draw(),
        this.playerManager.draw(),
		this.vehicleTimer.player && this.vehicleTimer.player._tempVehicleTicks > 0 && this.vehicleTimer.draw(),
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
		this.state.loading && this.loadingcircle.draw(),
        this.message.draw()
    }
    redraw() {
        this.track.undraw(),
        GameInventoryManager.redraw(),
        this.toolHandler.resize()
    }
	update() {
		this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update(),
        this.mouse.update(),
        this.state.paused || this.state.showDialog || (this.playerManager.updateGamepads(),
        this.playerManager.checkKeys()),
        this.screen.update(),
        this.updateControls(),
        this.camera.update(),
        this.sound.update(),
        this.restartTrack && this.restart(),
        !this.state.paused && this.state.playing && (this.message.update(),
        this.playerManager.update(),
		this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
		this.score.update(),
		this.vehicleTimer.update(),
        this.isStateDirty() && this.updateState(),
        this.draw(),
		this.pauseControls.draw(),
		this.controls && this.controls.draw(),
		this.camera.updateZoom()
	}
    stateChanged() {
        this.updateState()
    }
    toggleVehicle() {
        var t = this.track.allowedVehicles
            , e = t.length
            , i = (this.state.vehicle || this.vehicle).toUpperCase()
            , s = t.indexOf(i);
        s++,
        s >= e && (s = 0);
        var i = t[s];
        this.selectVehicle(i)
    }
    selectVehicle(t) {
        var e = this.track.allowedVehicles
            , i = e.indexOf(t);
        -1 !== i && (this.settings.track.vehicle = t,
        this.vehicle = t,
        this.playerManager.firstPlayer.setBaseVehicle(t),
        this.restartTrack = !0)
    }
    listen() {
        var t = this.playerManager.firstPlayer
            , e = t.getGamepad();
        e.listen()
    }
    unlisten() {
        var t = this.playerManager.firstPlayer
            , e = t.getGamepad();
        e.unlisten()
    }
    stopAudio() {
		this.sound && this.sound.stop_all()
    }
	close() {
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