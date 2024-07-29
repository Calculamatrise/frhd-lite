import i from "../math/cartesian.js";
import Tool from "./tool.js";

export default class Eraser extends Tool {
	name = 'eraser';
	options = null;
	constructor(t) {
		super(t);
		this.options = t.scene.settings.eraser;
		this.eraserPoint = new i;
		this.erasedObjects = [];
	}
	reset() {
		this.recordActionsToToolhandler()
	}
	press() {
		this.recordActionsToToolhandler()
	}
	recordActionsToToolhandler() {
		this.erasedObjects.length > 0 && this.toolhandler.addActionToTimeline({
			type: "remove",
			objects: this.erasedObjects.flat()
		}),
		this.erasedObjects = []
	}
	release() {
		this.recordActionsToToolhandler()
	}
	hold() {
		let t = this.mouse.touch
		  , e = t.pos
		  , i = this.scene.track
		  , s = this.scene.screen
		  , n = this.scene.camera
		  , o = s.center
		  , a = n.position
		  , h = (e.x - o.x) / n.zoom + a.x
		  , l = (e.y - o.y) / n.zoom + a.y;
		this.eraserPoint.x = Math.round(h),
		this.eraserPoint.y = Math.round(l);
		let c = i.erase(this.eraserPoint, this.options.radius / this.scene.camera.zoom, this.options.types);
		c.length > 0 && this.erasedObjects.push(c)
	}
	draw(e) {
		super.draw(e),
		this.drawEraser(e)
	}
	drawEraser(t) {
		let e = this.mouse.touch
		  , i = e.pos
		  , colorScheme = window.lite && lite.storage.get('theme');
		t.save();
		t.beginPath(),
		t.arc(i.x, i.y, this.options.radius, 0, 2 * Math.PI, !1),
		t.lineWidth = 1,
		t.fillStyle = /^midnight$/i.test(colorScheme) ? "rgba(29,35,40,0.8)" : /^dark$/i.test(colorScheme) ? "rgba(33,33,33,0.8)" : "rgba(255,255,255,0.8)",
		t.fill(),
		t.strokeStyle = this.scene.settings.physicsLineColor,
		t.stroke(),
		t.restore()
	}
	setOption(t, e) {
		this.options[t] = e
	}
	getOptions() {
		return this.options
	}
	update() {
		let t = this.toolhandler.gamepad
		  , e = this.mouse;
		t.isButtonDown("shift") && e.mousewheel !== !1 && this.adjustRadius(e.mousewheel),
		super.update();
	}
	adjustRadius(t) {
		let e = this.options.radius
		  , i = this.options.radiusSizeSensitivity
		  , s = this.options.maxRadius
		  , n = this.options.minRadius
		  , r = t > 0 ? i : -i;
		e += r,
		this.setOption("radius", Math.min(s, Math.max(n, e)))
	}
}