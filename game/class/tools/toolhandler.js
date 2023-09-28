import i from "../math/cartesian.js";
import n from "../sector/physicsline.js";
import r from "../sector/sceneryline.js";
import o from "../sector/powerups/target.js";

export default class {
	currentTool = "";
	scene = null;
	camera = null;
	mouse = null;
	tools = {}
	gamepad = null;
	gridCache = !1;
	gridCacheAlpha = 1;
	gridUseEnabled = !1;
	snapPoint = !1;
	options = null;
	constructor(t) {
		this.currentTool = "";
		this.scene = t;
		this.camera = t.camera;
		this.mouse = t.mouse;
		this.mouse.updateCallback = this.draw.bind(this);
		this.gamepad = t.playerManager.firstPlayer.getGamepad();
		this.options = t.settings.toolHandler;
		this.snapPoint = new i;
		this.snapPoint.equ(this.scene.track.defaultLine.p2);
		this.initAnalytics();
		this.actionTimeline = [];
		this.actionTimelineMax = 50;
		this.actionTimelinePointer = 0;
	}
	initAnalytics() {
		this.analytics = {
			actions: 0
		}
	}
	enableGridUse() {
		this.gridUseEnabled = !0
	}
	getToolOptions() {
		return this.tools[this.currentTool].getOptions()
	}
	setToolOption(t, e, i) {
		"undefined" != typeof i && "undefined" != typeof this.tools[i] ? this.tools[i].setOption(t, e) : this.tools[this.currentTool].setOption(t, e),
		this.scene.stateChanged()
	}
	registerTool(t) {
		t = new t(this);
		let e = t.name.toLowerCase();
		this.tools[e] = t;
	}
	setTool(t) {
		t = t.toLowerCase();
		this.currentTool !== t && (this.resetTool(),
		this.currentTool = t,
		this.scene.stateChanged(),
		this.analytics.actions++)
	}
	addActionToTimeline(t) {
		this.actionTimeline.length >= this.actionTimelineMax && (this.actionTimeline.splice(0, this.actionTimeline.length - this.actionTimelineMax),
		this.actionTimelinePointer = this.actionTimelineMax),
		this.actionTimeline.splice(this.actionTimelinePointer),
		this.actionTimeline.push(t),
		this.actionTimelinePointer++
	}
	revertAction() {
		let t = this.actionTimelinePointer;
		if (t > 0) {
			let e = this.actionTimeline[t - 1];
			switch (t--,
			e.type) {
			case "add":
				this.removeObjects(e.objects);
				break;
			case "remove":
				this.addObjects(e.objects)
			}
			this.actionTimelinePointer = t
		}
	}
	applyAction() {
		let t = this.actionTimeline
		  , e = this.actionTimelinePointer;
		if (e < t.length) {
			let i = this.actionTimeline[e];
			switch (e++,
			i.type) {
			case "add":
				this.addObjects(i.objects);
				break;
			case "remove":
				this.removeObjects(i.objects)
			}
			this.actionTimelinePointer = e
		}
	}
	removeObjects(t) {
		for (let e = t.length, i = 0; e > i; i++) {
			let s = t[i];
			s.remove = !0,
			s.removeAllReferences()
		}
		this.scene.track.cleanTrack()
	}
	addObjects(t) {
		for (let e = t.length, i = this.scene.track, s = 0; e > s; s++) {
			let a = t[s];
			a instanceof n ? (a.remove = !1,
			i.addPhysicsLineToTrack(a)) : a instanceof r ? (a.remove = !1,
			i.addSceneryLineToTrack(a)) : a instanceof o ? (a.remove = !1,
			i.addTarget(a),
			i.addPowerup(a)) : (a.remove = !1,
			i.addPowerup(a))
		}
	}
	resetTool() {
		"" !== this.currentTool && this.tools[this.currentTool].reset()
	}
	update() {
		this.checkGrid(),
		this.mouse.enabled && this.tools[this.currentTool].update(),
		this.checkHotkeys(),
		this.checkMouse(),
		this.checkSnap()
	}
	checkGrid() {
		let t = this.scene.camera;
		t.zoom !== t.desiredZoom && (this.gridCache = !1)
	}
	checkSnap() {
		this.options.snapLocked && (this.options.snap = !0)
	}
	moveCameraTowardsMouse() {
		if (this.options.cameraLocked === !1) {
			let t = this.scene.screen
			  , e = 100
			  , i = t.height - e
			  , s = 0 + e
			  , n = t.width - e
			  , r = 0 + e
			  , o = this.options.cameraMoveSpeed
			  , a = t.center
			  , h = this.camera
			  , l = this.mouse.touch
			  , c = l.pos.x
			  , u = l.pos.y
			  , p = .8 * (c - a.x)
			  , d = u - a.y;
			(c >= n || r >= c || u >= i || s >= u) && (h.position.x += p * o * (1 / h.zoom),
			h.position.y += d * o * (1 / h.zoom))
		}
	}
	checkMouse() {
		let t = this.mouse.touch
		  , e = this.mouse.secondaryTouch;
		(t.press || e.press) && this.press()
	}
	press() {
		this.camera.unfocus()
	}
	checkHotkeys() {
		let t = this.gamepad
		  , e = this.options.snap
		  , i = this.options.snapLocked
		  , s = this.options.rightClickMove
		  , n = t.isButtonDown("alt");
		s && (n = t.isButtonDown("shift")),
		n && !e ? this.toggleQuickSnap() : n || !e || i || this.toggleQuickSnap(),
		t.isButtonDown("ctrl") && t.isButtonDown("z") && (t.setButtonUp("z"),
		this.revertAction()),
		t.isButtonDown("ctrl") && t.isButtonDown("y") && (t.setButtonUp("y"),
		this.applyAction());
		let r = this.tools;
		for (let o in r) {
			let a = r[o];
			a.checkKeys()
		}
		this.gridUseEnabled && t.isButtonDown("grid") && (t.setButtonUp("grid"),
		this.toggleGrid()),
		t.isButtonDown("zoom_increase") && (t.setButtonUp("zoom_increase"),
		this.scene.camera.increaseZoom()),
		t.isButtonDown("zoom_decrease") && (t.setButtonUp("zoom_decrease"),
		this.scene.camera.decreaseZoom()),
		t.isButtonDown("zoom_100") && (t.setButtonUp("zoom_100"),
		this.scene.camera.resetZoom()),
		t.isButtonDown("lineType") && (t.setButtonUp("lineType"),
		this.toggleLineType())
	}
	toggleLineType() {
		let t = this.options.lineType;
		this.options.lineType = "physics" === t ? "scenery" : "physics",
		this.scene.stateChanged()
	}
	toggleGrid() {
		this.options.grid = this.scene.state.grid = !this.options.grid,
		this.scene.stateChanged()
	}
	toggleSnap() {
		this.options.snap = !this.options.snap,
		this.options.snapLocked = !this.options.snapLocked,
		this.resetTool(),
		this.scene.stateChanged()
	}
	toggleQuickSnap() {
		this.options.snapLocked || (this.options.snap = !this.options.snap,
		this.resetTool(),
		this.scene.stateChanged())
	}
	toggleCameraLock() {
		this.options.cameraLocked = !this.options.cameraLocked,
		this.scene.stateChanged()
	}
	draw(ctx) {
		this.mouse.enabled && this.tools[this.currentTool].draw(ctx)
	}
	drawGrid(e) {
		let t = this.scene.game.pixelRatio;
		this.options.grid === !0 && this.options.visibleGrid && this.drawCachedGrid(e, t)
	}
	drawCachedGrid(t, e) {
		this.gridCache === !1 && this.cacheGrid(e);
		let i = this.gridCache
		  , s = i.width
		  , n = i.height
		  , r = this.scene.screen
		  , o = r.center
		  , a = (o.x / s | 0) + 2
		  , h = (o.y / n | 0) + 2
		  , l = this.camera.zoom
		  , c = this.camera.position.x * l % s
		  , u = this.camera.position.y * l % n;
		t.globalAlpha = this.gridCacheAlpha;
		for (var p = -a; a > p; p++)
			for (var d = -h; h > d; d++) {
				var f = p * s - c + o.x
					, v = d * n - u + o.y;
				t.drawImage(i, 0, 0, n, s, f, v, s, n)
			}
		t.globalAlpha = 1
	}
	cacheGrid() {
		if (window.lite && lite.storage.get("isometricGrid"))
			return this.cacheIsometricGrid()
		let t = this.scene.camera.zoom
		  , e = 200 * t
		  , i = 200 * t
		  , n = this.options.gridSize
		  , r = n * t
		  , o = document.createElement("canvas");
		o.width = e,
		o.height = i;
		let a = o.getContext("2d");
		a.strokeStyle = this.options.gridMinorLineColor,
		a.strokeWidth = 1 * window.devicePixelRatio,
		a.beginPath();
		let h = null
		  , l = null
		  , c = null
		  , u = null;
		for (h = Math.floor(e / r), l = 0; h >= l; l++)
			c = l * r,
			a.moveTo(c, 0),
			a.lineTo(c, i);
		for (h = Math.floor(i / r), l = 0; h >= l; l++)
			u = l * r,
			a.moveTo(0, u),
			a.lineTo(e, u);
		a.stroke();
		a.beginPath(),
		a.rect(0, 0, e, i),
		a.lineWidth = 2 * window.devicePixelRatio,
		a.strokeStyle = this.options.gridMajorLineColor,
		a.stroke(),
		this.gridCache = o,
		this.gridCacheAlpha = Math.min(t + .2, 1)
	}
	cacheIsometricGrid() {
		let t = this.scene.camera.zoom
		  , e = 200 * t
		  , i = 200 * t
		  , n = this.options.gridSize
		  , r = n * t
		  , o = document.createElement("canvas");
		o.width = e,
		o.height = i;
		let a = o.getContext("2d");
		a.fillStyle = this.options.gridMinorLineColor;
		for (let width = Math.floor(e / r), l = 0; width >= l; l++) {
			for (let height = Math.floor(i / r), b = 0; height >= b; b += .5) {
				a.beginPath();
				a.arc(2 * b * r, (l + b % 1) * r, 1 * t, 0, 2 * Math.PI)
				a.fill()
			}
		}
		this.gridCache = o,
		this.gridCacheAlpha = Math.min(t + .2, 1)
	}
	resize() {
		let t = this.scene.game.pixelRatio;
		this.cacheGrid(t)
	}
	undo() {}
	redo() {}
	close() {
		this.actionTimeline = [],
		this.actionTimelinePointer = 0,
		this.tools = null,
		this.mouse = null,
		this.scene = null,
		this.camera = null,
		this.options.grid = !1,
		this.options = null,
		this.gridCache = null
	}
}