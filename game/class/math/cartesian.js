export default class {
	x = 0;
	y = 0;
	constructor(t, e) {
		this.x = t;
		this.y = e;
	}
	toReal(t) {
		let e = t.camera
		  , s = t.screen
		  , n = (this.x - s.center.x) / e.zoom + e.position.x
		  , r = (this.y - s.center.y) / e.zoom + e.position.y;
		return new this.constructor(n, r)
	}
	toScreen(t) {
		let e = t.camera
		  , s = t.screen
		  , n = (this.x - e.position.x) * e.zoom + s.center.x
		  , r = (this.y - e.position.y) * e.zoom + s.center.y;
		return new this.constructor(n, r)
	}
	lenSqr() {
		return this.dot(this)
	}
	len() {
		return Math.sqrt(this.lenSqr())
	}
	dot(t) {
		return this.x * t.x + this.y * t.y
	}
	factor(t) {
		return new this.constructor(this.x * t, this.y * t)
	}
	factorSelf(t) {
		this.x *= t,
		this.y *= t
	}
	factorOut(t, e) {
		e.x = this.x * t,
		e.y = this.y * t
	}
	add(t) {
		return new this.constructor(this.x + t.x, this.y + t.y)
	}
	inc(t) {
		this.x += t.x,
		this.y += t.y
	}
	addOut(t, e) {
		e.x = this.x + t.x,
		e.y = this.y + t.y
	}
	sub(t) {
		return new this.constructor(this.x - t.x, this.y - t.y)
	}
	subOut(t, e) {
		e.x = this.x - t.x,
		e.y = this.y - t.y
	}
	subSelf(t) {
		this.x -= t.x,
		this.y -= t.y
	}
	equ(t) {
		this.x = t.x,
		this.y = t.y
	}
	normalize() {
		let t = Math.sqrt(this.x ** 2 + this.y ** 2);
		return new this.constructor(this.x / t, this.y / t)
	}
	getAngleInDegrees(t) {
		let e = t.sub(this)
		  , i = Math.atan2(e.x, -e.y)
		  , s = i * (180 / Math.PI);
		return s < 0 && (s += 360),
		s
	}
	getAngleInRadians(t) {
		let e = t.sub(this);
		return Math.atan2(e.x, -e.y)
	}
}