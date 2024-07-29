import Vector from "../math/cartesian.js";
import EventEmitter from "../EventEmitter.js";

export default class extends EventEmitter {
	enabled = !0;
	touch = null;
	touches = [];
	updateCallback = !1;
	wheel = !1;
	mousewheel = !1;
	throttledMouseWheel = null;
	analytics = null;
	constructor(t) {
		super();
		Object.defineProperty(this, 'scene', { value: t || null, writable: true });
		this.touch = this.getTouchObject();
		this.touch.old = this.getTouchObject();
		this.secondaryTouch = this.getTouchObject();
		this.secondaryTouch.old = this.getTouchObject();
		this.initAnalytics();
		this.bindToMouseEvents();
	}
	initAnalytics() {
		this.analytics = { clicks: 0 }
	}
	getTouchObject() {
		return {
			id: null,
			down: !1,
			press: !1,
			release: !1,
			pos: new Vector(0,0),
			real: new Vector(0,0),
			type: 1
		}
	}
	bindToMouseEvents() {
		let e = this.scene.game.canvas
		  , i = this.onMouseMove.bind(this)
		  , n = this.onMouseDown.bind(this)
		  , r = this.onMouseUp.bind(this);
		e.addEventListener("pointermove", i, { passive: true }),
		e.addEventListener("pointerdown", n, { passive: true }),
		e.addEventListener("pointerup", r, { passive: true }),
		Object.defineProperties(this, {
			_moveListener: { value: i, writable: true },
			_upListener: { value: r, writable: true },
			_downListener: { value: n, writable: true }
		});
		let o = this.onMouseWheel.bind(this);
		e.addEventListener("mousewheel", o),
		e.addEventListener("wheel", o),
		Object.defineProperty(this, '_wheelListener', { value: o, writable: true })
	}
	contextMenuHandler(t) {
		return t.stopPropagation(),
		t.preventDefault(),
		!1
	}
	disableContextMenu() {
		this.scene.game.canvas.oncontextmenu = function() {
			return !1
		}
	}
	onMouseDown(t) {
		this.scene.game.canvas.setPointerCapture(t.pointerId),
		this.analytics.clicks++,
		2 === t.button ? this.secondaryTouch.down === !1 && (this.updatePosition(t, this.secondaryTouch),
		this.secondaryTouch.down = !0) : this.touch.down === !1 && (this.updatePosition(t, this.touch),
		this.touch.down = !0,
		this.scene.redrawControls())
	}
	onMouseMove(t) {
		this.updatePosition(t, this.touch),
		this.scene.redrawControls(),
		this.updatePosition(t, this.secondaryTouch)
	}
	onMouseUp(t) {
		this.scene.game.canvas.releasePointerCapture(t.pointerId),
		2 === t.button ? this.secondaryTouch.down === !0 && (this.updatePosition(t, this.secondaryTouch),
		this.secondaryTouch.down = !1) : this.touch.down === !0 && (this.updatePosition(t, this.touch),
		this.scene.interactWithControls(),
		this.touch.down = !1,
		this.scene.redrawControls())
	}
	onMouseWheel(t) {
		t.preventDefault(),
		t.stopPropagation();
		let e = Math.max(-1, Math.min(1, -t.deltaY || -t.detail));
		return 0 == e && (e = Math.max(-1, Math.min(1, t.deltaX || -t.detail))),
		this.wheel = e,
		!1
	}
	update() {
		this.enabled && (this.updateTouch(this.touch),
		this.updateTouch(this.secondaryTouch),
		this.updateWheel())
	}
	updatePosition(t, e) {
		e.id = t.pointerId,
		e.type = t.button;
		let i = e.pos;
		i.x = t.offsetX * window.devicePixelRatio,
		i.y = t.offsetY * window.devicePixelRatio,
		this.updateRealPosition(e)
	}
	updateRealPosition(t) {
		let i = t.real;
		i.x = Math.round((t.pos.x - this.scene.screen.center.x) / this.scene.camera.zoom + this.scene.camera.position.x),
		i.y = Math.round((t.pos.y - this.scene.screen.center.y) / this.scene.camera.zoom + this.scene.camera.position.y);
		if (this.scene.toolHandler.options.grid) {
			let p = this.scene.settings.toolHandler.gridSize | 0;
			if (lite.storage.get("isometricGrid")) {
				const c = (t, e) => ((t % e) + e) % e;
				let g = p / 2
				  , adjusted = Math.round(i.x / p)
				  , k = c(adjusted, 2);
				i.x = adjusted * p;
				i.y = i.y - c(i.y + g * (k + 1), p) - (g * (k - 1)) + (k * g);
			} else {
				i.x = Math.round(i.x / p) * p
				i.y = Math.round(i.y / p) * p
			}
		}
		this.updateCallback = !0
	}
	updateTouch(t) {
		t.old.pos.x = t.pos.x,
		t.old.pos.y = t.pos.y,
		t.old.real.x = t.real.x,
		t.old.real.y = t.real.y,
		!t.old.down && t.down && (t.press = !0),
		t.old.down && !t.down && (t.release = !0),
		t.old.press && (t.press = !1),
		t.old.release && (t.release = !1),
		this.updateRealPosition(t),
		t.old.down = t.down,
		t.old.press = t.press,
		t.old.release = t.release
	}
	updateWheel() {
		this.mousewheel = this.wheel,
		this.wheel = !1
	}
	close() {
		let e = this.scene.game.canvas;
		e.removeEventListener("mousewheel", this._wheelListener),
		e.removeEventListener("wheel", this._wheelListener),
		this.touches = null,
		this.touch = null,
		this.scene = null,
		this.wheel = null,
		this._moveListener = null,
		this._downListener = null,
		this._upListener = null,
		this._wheelListener = null
	}
}