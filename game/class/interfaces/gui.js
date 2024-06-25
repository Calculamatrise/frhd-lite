import Container from "./container.js";

export default class {
	cached = !1;
	canvas = null;
	container = new Container;
	constructor(t, e) {
		Object.defineProperty(this, 'scene', { value: t, writable: true }),
		Object.assign(this.container, e)
	}
	draw(t) {
		this.container.draw(t)
	}
	redraw() {
		this.container.setDirty()
	}
	update() {
		let t = this.container;
		t.cached ||= -1 === t.children.findIndex(t => !t.cached)
	}
}