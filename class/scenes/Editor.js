import b from "../controls/pause.js";
import T from "../controls/redoundo.js";
import p from "../tools/brushtool.js";
import l from "../tools/cameratool.js";
import c from "../tools/curvetool.js";
import f from "../tools/erasertool.js";
import v from "../tools/poweruptool.js";
import d from "../tools/selecttool.js";
import u from "../tools/straightlinetool.js";
import h from "../tools/toolhandler.js";
import g from "../tools/vehiclepoweruptool.js";
import m from "../tracks/track.js";
import y from "../utils/loadingcircle.js";
import k from "../utils/messagemanager.js";
import s from "../utils/mousehandler.js";
import w from "../utils/score.js";
import C from "../utils/soundmanager.js";
import a from "../utils/vehicletimer.js";
import o from "../vehicles/player_manager.js";
import n from "../view/camera.js";
import r from "../view/screen.js";

export default class {
    constructor(t) {
        this.game = t;
        this.assets = t.assets;
        this.settings = t.settings;
        this.sound = new C(this);
        this.mouse = new s(this);
        this.mouse.disableContextMenu();
        this.message = new k(this);
        this.camera = new n(this);
        this.screen = new r(this);
        this.createTrack();
        this.loadingcircle = new y(this);
        this.playerManager = new o(this);
        this.vehicleTimer = new a(this);
        this.score = new w(this);
        this.createMainPlayer();
        this.createControls();
        this.registerTools();
        this.state = this.setStateDefaults();
        this.oldState = this.setStateDefaults();
        this.restart();
        this.initializeAnalytics();
        window.addEventListener("mousedown", this.tapToStartOrRestart.bind(this));
        this.injectLiteFeatures();
    }
    game = null;
    assets = null;
    canvas = null;
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
    dialogOptions = !1;
    importCode = !1;
    clear = !1;
    redoundoControls = null;
    pauseControls = null;
    inFocus = !0;
    controls = null;
    verified = !1;
    injectLiteFeatures() {
        let it = setInterval(() => {
            if (this.game.gameContainer.querySelector('.bottomToolOptions_straightline')) {
                this.game.gameContainer.querySelector('.bottomToolOptions_straightline').after(Object.assign(document.createElement("div"), {
                    id: "trackMover",
                    className: "bottomMenu-button bottomMenu-button-left bottomMenu-button",
                    title: "Move your track quickly and easily",
                    innerHTML: `<span class="name">Move Track</span>
                    &emsp;<input type="number" id="moveX" placeholder="Position X" onkeydown="event.stopPropagation()" onkeypress="event.stopPropagation()" onkeyup="event.stopPropagation()"></input>
                    &emsp;<input type="number" id="moveY" placeholder="Position Y" onkeydown="event.stopPropagation()" onkeypress="event.stopPropagation()" onkeyup="event.stopPropagation()"></input>`,
                    onclick() {
                        lite.setVar("move", !lite.getVar("move"));
                        // lite.moveTrack()
                    }
                }));
                clearInterval(it);
            }
        });
        let is = setInterval(() => {
            if (this.game.gameContainer.querySelector(".sideButton_cameraTool")) {
                this.game.gameContainer.querySelector(".sideButton_cameraTool").after(Object.assign(document.createElement('div'), {
                    className: "sideButton sideButton-bottom sideButton_selectTool",
                    innerHTML: `<span style="width:44px;height:44px;display:flex"><img src="https://i.imgur.com/FLP6RhL.png" style="display:inline-flex;margin:auto;width:30px;height:30px;"></span>`,
                    onclick() {
                        GameManager.game.currentScene.toolHandler.setTool('select'),
                        this.className = 'sideButton sideButton-bottom sideButton_selectTool active';
                        [...document.getElementsByClassName('sideButton')].forEach(e => {
                            if (e.className.includes("sideButton sideButton-bottom sideButton_selectTool active")) return;
                            e.onclick = () => {
                                this.className = 'sideButton sideButton-bottom sideButton_selectTool';
                            }
                        });
                    }
                })),
                clearInterval(is)
            }
        });
    }
    getCanvasOffset() {
        var t = {
            height: 90,
            width: 0
        };
        return this.settings.isStandalone && (t = {
            height: 202,
            width: 0
        }),
        t
    }
    tapToStartOrRestart() {
        if (this.settings.mobile) {
            var t = this.playerManager.firstPlayer;
            if (t && t._crashed && !this.state.paused) {
                var e = t.getGamepad();
                e.setButtonDown("enter")
            } else
                this.play()
        }
    }
    analytics = null;
    initializeAnalytics() {
        this.analytics = {
            deaths: 0,
            mouseEvents: 0
        },
        this.trackAction("editor-open", "open")
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
    createControls() {
        this.redoundoControls = new T(this),
        this.pauseControls = new b(this)
    }
    createTrack() {
        this.track && this.track.close();
        var t = new m(this)
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
    registerTools() {
        var t = new h(this);
        t.enableGridUse(),
        this.toolHandler = t,
        t.registerTool(l),
        t.registerTool(c),
        t.registerTool(u),
        t.registerTool(p),
        t.registerTool(d),
        t.registerTool(f),
        t.registerTool(v),
        t.registerTool(g),
        t.setTool(this.settings.startTool)
    }
    updateToolHandler() {
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update()
    }
    play() {
        this.state.playing = !0
    }
    update() {
        this.updateToolHandler(),
        this.mouse.update(),
        this.state.showDialog || (this.updateGamepads(),
        this.checkGamepads()),
        this.screen.update(),
        this.updateControls(),
        this.camera.update(),
        this.sound.update(),
        this.restartTrack && this.restart(),
        !this.state.paused && this.state.playing && (this.message.update(),
        this.updatePlayers(),
        this.score.update(),
        this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
        this.vehicleTimer.update(),
        (this.importCode || this.clear) && this.createTrack(),
        this.isStateDirty() && this.updateState(),
        this.game.canvas.getContext("2d").clearRect(0, 0, this.game.canvas.width, this.game.canvas.height),
        this.draw(),
        this.camera.updateZoom()
    }
    isStateDirty() {
        var t = this.oldState
            , e = this.state
            , i = !1;
        for (var s in e)
            e[s] !== t[s] && (i = !0,
            this.oldState[s] = e[s]);
        return i
    }
    updateGamepads() {
        this.playerManager.updateGamepads()
    }
    checkGamepads() {
        this.playerManager.checkKeys()
    }
    stopAudio() {
        createjs.Sound.stop()
    }
    restart() {
        this.verified = !this.settings.requireTrackVerification,
        this.track.dirty = !1,
        this.track.resetPowerups(),
        this.message.hide(),
        this.restartTrack = !1,
        this.state.playing = !1,
        this.ticks = 0,
        this.playerManager.reset(),
        this.camera.focusOnPlayer(),
        this.camera.fastforward(),
        this.score.update()
    }
    buttonDown(t) {
        var e = this.camera;
        switch (this.state.playing = !0,
        t) {
        case "up":
        case "down":
        case "left":
        case "right":
            e.focusOnMainPlayer();
            break;
        case "change_camera":
            e.focusOnNextPlayer();
            break;
        case "pause":
            this.state.paused = !this.state.paused;
            break;
        case "settings":
            this.command("dialog", "settings");
            break;
        case "change_vehicle":
            this.toggleVehicle(),
            this.stateChanged();
            break;
        case "zoom_increase":
            e.increaseZoom(),
            this.stateChanged();
            break;
        case "zoom_decrease":
            e.decreaseZoom(),
            this.stateChanged();
            break;
        case "fullscreen":
            this.toggleFullscreen(),
            this.stateChanged()
        }
    }
    toggleFullscreen() {
        if (this.settings.embedded) {
            window.open(this.settings.basePlatformUrl + "/t/" + this.settings.track.url)
        } else
            this.settings.fullscreenAvailable && (this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen)
    }
    updatePlayers() {
        this.playerManager.update()
    }
    drawPlayers() {
        this.playerManager.draw()
    }
    draw() {
        this.toolHandler.drawGrid(),
        this.track.draw(),
        this.drawPlayers(),
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.draw(),
        this.redoundoControls.draw(),
        this.pauseControls.draw(),
        this.state.loading && this.loadingcircle.draw(),
        this.message.draw(),
        this.score.draw(),
        this.vehicleTimer.draw()
    }
    getAvailableTrackCode() {
        let e = !1;
        return this.settings.importCode && "false" !== this.settings.importCode ? (e = this.settings.importCode,
        this.settings.importCode = null) : this.importCode && (e = this.importCode,
        this.importCode = null),
        e
    }
    redraw() {
        this.track.undraw(),
        GameInventoryManager.redraw(),
        this.toolHandler.resize()
    }
    resize() {
        this.pauseControls.resize(),
        this.redoundoControls.resize(),
        this.controls && this.controls.resize()
    }
    updateState() {
        if (null !== this.game.onStateChange) {
            var t = this.state;
            t.tool = this.toolHandler.currentTool,
            t.toolOptions = this.toolHandler.getToolOptions(),
            t.grid = this.toolHandler.options.grid,
            t.cameraLocked = this.toolHandler.options.cameraLocked,
            t.zoomPercentage = this.camera.zoomPercentage,
            t.vehicle = this.vehicle,
            this.game.onStateChange(this.state)
        }
    }
    stateChanged() {
        this.updateState()
    }
    setStateDefaults() {
        var t = {};
        return t.paused = this.settings.mobile ? !0 : this.settings.startPaused,
        t.loading = !1,
        t.playing = this.settings.waitForKeyPress,
        t.tool = this.toolHandler.currentTool,
        t.toolOptions = this.toolHandler.getToolOptions(),
        t.grid = this.toolHandler.options.grid,
        t.cameraLocked = this.toolHandler.options.cameraLocked,
        t.zoomPercentage = this.camera.zoomPercentage,
        t.vehicle = this.vehicle,
        t.showDialog = !1,
        t.dialogOptions = !1,
        t.preloading = !1,
        t.fullscreen = this.settings.fullscreen,
        t.inFocus = !0,
        this.controls && (t.hideMenus = this.controls.isVisible()),
        t
    }
    toggleVehicle() {
        var t = this.track.allowedVehicles
            , e = t.length
            , i = this.state.vehicle
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
    trackAction(t, e) {
        var i = this.toolHandler.analytics.actions
            , s = this.mouse.analytics.clicks
            , n = i + s
            , r = {
            category: "create",
            action: t,
            label: e,
            value: n,
            non_interaction: !0
        };
        Application.Helpers.GoogleAnalyticsHelper.track_event(r)
    }
    openDialog(t) {
        switch (this.state.dialogOptions = {},
        t) {
        case "import":
            break;
        case "export":
            setTimeout(this.getTrackCode.bind(this), 750);
            break;
        case "upload":
            "undefined" == typeof isChromeApp && setTimeout(this.getTrackCode.bind(this), 750)
        }
        this.state.playing = !1,
        this.state.showDialog = t
    }
    getTrackCode() {
        this.state.dialogOptions = {},
        this.state.dialogOptions.verified = this.verified,
        this.state.dialogOptions.code = this.track.getCode()
    }
    trackComplete() {
        this.verified = this.track.dirty ? !1 : !0
    }
    hideControlPlanel() {}
    showControlPlanel() {}
    command() {
        var t = Array.prototype.slice.call(arguments, 0)
            , e = t.shift();
        switch (e) {
        case "change tool":
            var i = t[0];
            this.toolHandler.setTool(i);
            break;
        case "change tool option":
            var s = t[0]
                , n = t[1];
            "undefined" != typeof t[2] ? this.toolHandler.setToolOption(s, n, t[2]) : this.toolHandler.setToolOption(s, n);
            break;
        case "snap":
            this.toolHandler.toggleSnap();
            break;
        case "add track":
            this.importCode = t[0].code;
            break;
        case "redraw":
            this.redraw();
            break;
        case "fullscreen":
            this.settings.fullscreen = this.state.fullscreen = !this.settings.fullscreen;
            break;
        case "grid":
            this.toolHandler.toggleGrid();
            break;
        case "lock camera":
            this.toolHandler.toggleCameraLock();
            break;
        case "toggle vehicle":
            this.toggleVehicle(),
            this.stateChanged();
            break;
        case "reset zoom":
            this.camera.resetZoom();
            break;
        case "increase zoom":
            this.camera.increaseZoom();
            break;
        case "decrease zoom":
            this.camera.decreaseZoom();
            break;
        case "change lineType":
            var r = t[0];
            this.toolHandler.options.lineType = r,
            this.stateChanged();
            break;
        case "resize":
            this.resize();
            break;
        case "dialog":
            var o = t[0];
            o === !1 ? this.listen() : this.unlisten(),
            this.openDialog(o);
            break;
        case "focused":
            var a = t[0];
            a === !0 ? (this.state.inFocus = !0,
            this.state.showDialog === !1 && this.listen()) : (this.state.inFocus = !1,
            this.unlisten(),
            this.state.playing = !1);
            break;
        case "clear track":
            this.trackAction("editor-action", "clear"),
            this.clear = !0;
            break;
        case "import":
            var h = t[0];
            h.length <= 0 && (h = !1),
            this.importCode = h,
            this.clear = t[1],
            this.command("dialog", !1)
        }
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
        createjs.Sound.stop()
    }
    close() {
        this.trackAction("editor-exit", "exit"),
        this.pauseControls = null,
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