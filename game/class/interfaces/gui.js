import Container from "./container.js";

export default class {
	cached = !1;
	canvas = null;
	container = new Container;
	enabled = !0;
	// inset = 0;
	constructor(t, e) {
		Object.defineProperty(this, 'scene', { value: t, writable: true }),
		Object.assign(this.container, e)
	}
	draw(t) {
		this.enabled && this.container.draw(t)
	}
	updateInset(initialY) {
		let t = this.scene
		  , e = t.settings
		  , i = e.fullscreen && e.inset.top
		  , s = initialY + i;
		this.container.y !== s && (this.container.y = s)
	}
	redraw() {
		this.container.setDirty()
	}
	resize() {
		this.redraw()
	}
	update() {
		let t = this.container;
		t.cached ||= -1 === t.children.findIndex(t => !t.cached)
	}
}