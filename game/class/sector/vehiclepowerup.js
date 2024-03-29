import Powerup from "./powerup.js";

export default class extends Powerup {
	hit = !1;
	index = null;
	prefix = 'V';
	stack = [];
	constructor(t, e, i, s) {
		super(s);
		this.x = t;
		this.y = e;
		this.time = i;
		this.id = Math.random().toString(36).slice(2);
	}
	draw(t, e, i, s) {
		this.hit || super.draw(t, e, i, s)
	}
	getCode() {
		let t = this.time
		  , e = super.getCode() + ' ' + this.index + ' '
		  , i = '';
		this.stack.length > 0 && (i += ',' + this.stack.map(s => e + s.toString(32)).join(','),
		t -= this.stack.reduce((i, s) => i += s, 0));
		return e + t.toString(32) + i
	}
	recache(t) {
		this.constructor.cache.dirty = !1;
		let e = this.constructor.cache.canvas;
		e.width = this.constructor.cache.width * t,
		e.height = this.constructor.cache.height * t;
		let i = e.getContext('2d')
		  , s = e.width / 2
		  , r = e.height / 2;
		this.drawIcon(s, r, t, i),
		this.settings.developerMode && (i.beginPath(),
		i.rect(0, 0, e.width, e.height),
		i.strokeStyle = 'red',
		i.strokeWidth = 1 * t,
		i.stroke())
	}
	static createCache() {
		return Object.assign(super.createCache(), {
			width: 24,
			height: 24
		})
	}
}