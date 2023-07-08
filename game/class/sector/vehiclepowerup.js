import Powerup from "./powerup.js";

export default class extends Powerup {
	recache(t) {
		this.constructor.cache.dirty = !1;
		let e = this.constructor.cache.canvas;
		e.width = this.constructor.cache.width * t,
		e.height = this.constructor.cache.height * t;
		let i = e.getContext("2d")
		  , s = e.width / 2
		  , r = e.height / 2;
		this.drawIcon(s, r, t, i)
	}
	static cache = Object.assign({}, this.cache, {
		canvas: document.createElement("canvas"),
		width: 32,
		height: 42
	})
}