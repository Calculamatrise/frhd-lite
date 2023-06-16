import Scene from "./Scene.js";
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

export default class extends Scene {
	canvas = null;
    dialogOptions = !1;
    clear = !1;
    redoundoControls = null;
    inFocus = !0;
    verified = !1;
    constructor(t) {
        super(t);
        this.mouse.disableContextMenu(),
        this.createMainPlayer(),
        this.createControls(),
        this.registerTools(),
        this.state = this.setStateDefaults(),
        this.oldState = this.setStateDefaults(),
        this.restart(),
        this.initializeAnalytics(),
        this.injectLiteFeatures()
    }

    injectLiteFeatures() {
        if (!this.game || !GameManager.game) {
            return;
        }

        let it = setInterval(() => {
            if (!this.game) {
                if (GameManager.game !== null) {
                    this.game = GameManager.game;
                }
            }

            if (this.game.gameContainer.querySelector('.bottomToolOptions_straightline')) {
                this.game.gameContainer.querySelector('.bottomToolOptions_straightline').after(Object.assign(document.createElement("div"), {
                    className: "bottomMenu-button bottomMenu-button-left bottomMenu-button",
                    id: "trackMover",
                    innerHTML: "Move Track",
                    onclick: () => {
                        let t = this.game.gameContainer.querySelector("#trackMover");
                        let e = t.onclick;
                        let i = this.toolHandler.currentTool;
                        t.innerHTML = "Stop";
                        this.toolHandler.setTool("camera");
                        this.toolHandler.tools.camera.frozen = true;
                        t.onclick = () => {
                            t.innerHTML = "Move Track";
                            this.toolHandler.setTool(i);
                            this.toolHandler.tools.camera.frozen = false;
                            t.onclick = e;
                        }
                    }
                }));
                clearInterval(it);
            }
        });

        let ie = setInterval(() => {
            if (!this.game) {
                if (GameManager.game !== null) {
                    this.game = GameManager.game;
                }
            }
            
            if (this.game.gameContainer.querySelector(".sideButton_cameraTool") && !this.game.gameContainer.querySelector(".sideButton-bottom.sideButton_selectTool")) {
                [...document.getElementsByClassName('sideButton')].forEach(e => {
                    e.onclick = () => {
                        if (e.classList.contains("active")) {
                            setTimeout(() => {
                                e.classList.remove("active");
                                
                                this.toolHandler.setTool("select");
                            });
                        }
                    }
                });
                clearInterval(ie)
            }
        }, 1000);
    }
    getCanvasOffset() {
        return {
            height: this.settings.isStandalone ? 202 : 90,
            width: 0
        }
    }
    initializeAnalytics() {
        this.analytics = {
            deaths: 0,
            mouseEvents: 0
        },
        this.trackAction("editor-open", "open")
    }
    createControls() {
        this.redoundoControls = new T(this),
        this.pauseControls = new b(this)
    }
    registerTools() {
        this.toolHandler = new h(this);
        this.toolHandler.enableGridUse(),
        this.toolHandler.registerTool(l),
        this.toolHandler.registerTool(c),
        this.toolHandler.registerTool(u),
        this.toolHandler.registerTool(p),
        this.toolHandler.registerTool(d),
        this.toolHandler.registerTool(f),
        this.toolHandler.registerTool(v),
        this.toolHandler.registerTool(g),
        this.toolHandler.setTool(this.settings.startTool)
    }
    play() {
        this.state.playing = !0
    }
	interactWithControls() {
		super.interactWithControls(),
		this.redoundoControls.click()
	}
	updateControls() {
        super.updateControls(),
        this.redoundoControls.update()
	}
    update() {
        this.controls && this.controls.isVisible() !== !1 || this.toolHandler.update(),
        this.mouse.update(),
        this.state.showDialog || (this.playerManager.updateGamepads(),
        this.playerManager.checkKeys()),
        this.screen.update(),
        this.updateControls(),
        this.camera.update(),
        this.sound.update(),
        this.restartTrack && this.restart(),
        !this.state.paused && this.state.playing && (this.message.update(),
        this.playerManager.update(),
        this.score.update(),
        this.playerManager.firstPlayer.complete ? this.trackComplete() : this.ticks++),
        this.vehicleTimer.update(),
        (this.importCode || this.clear) && this.createTrack(),
        this.isStateDirty() && this.updateState(),
        this.draw(),
		this.pauseControls.draw(),
		this.redoundoControls.draw(),
        this.controls && this.controls.draw(),
        this.camera.updateZoom()
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
        let e = this.camera;
        this.state.playing = !0;
        switch (t) {
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
    close() {
        this.trackAction("editor-exit", "exit"),
		super.close()
    }
}