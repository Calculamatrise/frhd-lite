import Powerup from "./powerup.js";

export default class extends Powerup {
	hit = !1;
	constructor(t, e, i, s) {
		super(s);
		this.x = t;
		this.y = e;
		this.time = i;
		this.id = Math.random().toString(36).slice(2);
	}
	getCode() {
		return 'V ' + super.getCode()
	}
	recache(t) {
		this.constructor.cache.dirty = !1;
		let e = this.constructor.cache.canvas;
		e.width = this.constructor.cache.width * t,
		e.height = this.constructor.cache.height * t;
		let i = e.getContext('2d')
		  , s = e.width / 2
		  , r = e.height / 2;
		this.drawIcon(s, r, t, i)
	}
	static createCache() {
		return Object.assign(super.createCache(), {
			width: 32,
			height: 42
		})
	}
}