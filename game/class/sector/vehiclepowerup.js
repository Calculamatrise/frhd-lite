import Consumable from "./consumable.js";

export default class extends Consumable {
	index = null;
	prefix = 'V';
	stack = [];
	constructor(t, e, i, s) {
		super(s);
		this.x = t;
		this.y = e;
		this.time = i
	}
	draw(t, e, i, s) {
		this.hit || super.draw(t, e, i, s)
	}
	drawIcon() {}
	drawPowerup() {
		this.drawIcon(...arguments)
	}
	getCode() {
		let t = this.time
		  , e = super.getCode() + ' ' + this.index + ' '
		  , i = '';
		this.stack.length > 0 && (i += ',' + this.stack.map(s => e + s.toString(32)).join(','),
		t -= this.stack.reduce((i, s) => i += s, 0));
		return e + t.toString(32) + i
	}
}