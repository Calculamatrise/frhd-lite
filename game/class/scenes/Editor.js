import Scene from "./Scene.js";
import b from "../controls/pause.js";
import T from "../controls/redoundo.js";
import p from "../tools/brushtool.js";
import c from "../tools/curvetool.js";
import f from "../tools/erasertool.js";
import v from "../tools/poweruptool.js";
import d from "../tools/selecttool.js";
import u from "../tools/straightlinetool.js";
import g from "../tools/vehiclepoweruptool.js";

export default class extends Scene {
	clear = !1;
	redoundoControls = null;
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
		this.initializeAnalytics()
	}
	createMainPlayer() {
		let i = super.createMainPlayer();
		i.setKeyMap(this.settings.editorHotkeys)
	}
	createTrack() {
		let t = super.createTrack()
		  , e = this.getAvailableTrackCode();
		0 != e ? (t.read(e),
		this.state.preloading = !1,
		this.state.loading = !1) : t.addDefaultLine(),
		this.importCode = !1,
		this.restartTrack = !0,
		this.clear = !1
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
	redrawControls() {
		super.redrawControls(),
		this.redoundoControls.redraw()
	}
	registerTools() {
		let t = super.registerTools();
		t.enableGridUse(),
		t.registerTool(c),
		t.registerTool(u),
		t.registerTool(p),
		t.registerTool(d),
		t.registerTool(f),
		t.registerTool(v),
		t.registerTool(g),
		t.setTool(this.settings.startTool)
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
	fixedUpdate() {
		this.updateToolHandler(),
		this.mouse.update(),
		this.state.showDialog || (this.playerManager.updateGamepads(),
		this.playerManager.checkKeys()),
		super.fixedUpdate(),
		(this.importCode || this.clear) && this.createTrack()
	}
	draw(ctx) {
		super.draw(...arguments),
		this.redoundoControls.draw(ctx)
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
		super.buttonDown(t);
		let e = this.camera;
		this.state.playing = !0;
		switch (t) {
		case "up":
		case "down":
		case "left":
		case "right":
			e.focusOnMainPlayer()
		}
	}
	resize() {
		this.pauseControls.resize(),
		this.redoundoControls.resize(),
		super.resize()
	}
	updateState() {
		let t = this.state;
		t && (t.tool = this.toolHandler.currentTool,
		t.toolOptions = this.toolHandler.getToolOptions(),
		t.grid = this.toolHandler.options.grid,
		t.cameraLocked = this.toolHandler.options.cameraLocked,
		super.updateState())
	}
	setStateDefaults() {
		let t = super.setStateDefaults();
		return t.paused = this.settings.startPaused,
		t.loading = !1,
		t.playing = this.settings.waitForKeyPress,
		t.preloading = !1,
		t.tool = this.toolHandler.currentTool,
		t.toolOptions = this.toolHandler.getToolOptions(),
		t.grid = this.toolHandler.options.grid,
		t.cameraLocked = this.toolHandler.options.cameraLocked,
		t.zoomPercentage = this.camera.zoomPercentage,
		t.vehicle = this.vehicle,
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
		super.openDialog(t)
	}
	getTrackCode() {
		this.state.dialogOptions = {},
		this.state.dialogOptions.verified = this.verified,
		this.state.dialogOptions.code = this.track.getCode()
	}
	trackComplete() {
		this.verified = !this.track.dirty
	}
	hideControlPlanel() {}
	showControlPlanel() {}
	command(t, ...e) {
		super.command(...arguments);
		switch (t) {
		case "change tool":
			let i = e[0];
			this.toolHandler.setTool(i);
			break;
		case "change tool option":
			let s = e[0]
			  , n = e[1];
			"undefined" != typeof e[2] ? this.toolHandler.setToolOption(s, n, e[2]) : this.toolHandler.setToolOption(s, n);
			break;
		case "snap":
			this.toolHandler.toggleSnap();
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
			this.updateState();
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
			let r = e[0];
			this.toolHandler.options.lineType = r,
			this.updateState();
			break;
		case "clear track":
			this.trackAction("editor-action", "clear"),
			this.clear = !0;
			break;
		case "import":
			let h = e[0];
			h.length <= 0 && (h = !1),
			this.importCode = h,
			this.clear = e[1],
			this.command("dialog", !1)
		}
	}
	close() {
		this.trackAction("editor-exit", "exit"),
		super.close()
	}
}