import Container from "./container.js";

export default class {
	cached = !1;
	canvas = null;
	container = new Container;
	components = {};
	scene = null;
	constructor(t, e) {
		this.scene = t,
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
		t.cached ||= t.children.findIndex(t => !t.cached) === -1
	}
}